<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Sheep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('customer')->orderBy('sale_date', 'desc')->get();
        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales,
            'fullScreen' => true,
        ]);
    }

    public function create()
    {
        // Only sheep that are not sold can be sold
        $sheep = Sheep::where('status', '!=', 'Terjual')->get();
        $customers = Customer::all();

        return Inertia::render('Admin/Sales/Form', [
            'sheep' => $sheep,
            'customers' => $customers,
            'fullScreen' => true,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'nullable|string',
            'customer_address' => 'nullable|string',
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.sheep_id' => 'required|exists:sheep,id',
            'items.*.price' => 'required|numeric|min:0',
            'dp_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'required|string', // Belum Bayar, DP, Lunas
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Get or create customer
            $customer = Customer::updateOrCreate(
                ['name' => $request->customer_name],
                [
                    'phone' => $request->customer_phone,
                    'address' => $request->customer_address
                ]
            );

            // 2. Create Sale
            $totalAmount = collect($request->items)->sum('price');
            $invoiceNo = 'INV-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));

            $sale = Sale::create([
                'invoice_no' => $invoiceNo,
                'customer_id' => $customer->id,
                'sale_date' => $request->sale_date,
                'total_amount' => $totalAmount,
                'dp_amount' => $request->dp_amount ?? 0,
                'payment_status' => $request->payment_status,
                'notes' => $request->notes,
            ]);

            // 3. Create Sale Items and Update Sheep Status
            foreach ($request->items as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'sheep_id' => $item['sheep_id'],
                    'price' => $item['price'],
                ]);

                $sheep = Sheep::find($item['sheep_id']);
                $sheep->update([
                    'status' => 'Terjual',
                    'sold_at' => now(),
                ]);
            }

            // 4. Initialize Distribution
            $sale->distribution()->create([
                'delivery_status' => 'Persiapan',
            ]);

            return redirect()->route('admin.sales.index')->with('success', 'Penjualan berhasil dicatat.');
        });
    }

    public function show($id)
    {
        $sale = Sale::with(['customer', 'items.sheep', 'distribution'])->findOrFail($id);
        return Inertia::render('Admin/Sales/Show', [
            'sale' => $sale,
            'fullScreen' => true,
        ]);
    }

    public function updatePayment(Request $request, $id)
    {
        $sale = Sale::findOrFail($id);

        $request->validate([
            'payment_status' => 'required|string|in:Belum Bayar,DP,Lunas',
            'dp_amount' => 'nullable|numeric|min:0',
        ]);

        $sale->update([
            'payment_status' => $request->payment_status,
            'dp_amount' => $request->payment_status === 'DP' ? $request->dp_amount : ($request->payment_status === 'Lunas' ? $sale->total_amount : 0),
        ]);

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $sale = Sale::with('items.sheep')->findOrFail($id);

        return DB::transaction(function () use ($sale) {
            // 1. Revert sheep status
            foreach ($sale->items as $item) {
                if ($item->sheep) {
                    $item->sheep->update([
                        'status' => 'Siap Jual',
                        'sold_at' => null,
                    ]);
                }
            }

            // 2. Delete the sale (this will cascade delete sale_items and distribution due to DB constraints)
            $sale->delete();

            return redirect()->route('admin.sales.index')->with('success', 'Transaksi berhasil dihapus dan stok domba telah dikembalikan.');
        });
    }
}
