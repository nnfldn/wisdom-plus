<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsSheep;
use App\Http\Controllers\Controller;
use App\Http\Requests\BreedingStoreRequest;
use App\Http\Requests\BreedingUpdateRequest;
use App\Models\BreedingRecord;
use App\Models\Sheep;
use App\Traits\LogsActivity;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BreedingController extends Controller
{
    use LogsActivity, TransformsSheep;

    public function index(): Response
    {
        $records = BreedingRecord::with(['male', 'female'])
            ->orderBy('mating_date', 'desc')
            ->get();

        $males = Sheep::where('gender', 'Jantan')->select(['id', 'tag', 'type'])->get();
        $females = Sheep::where('gender', 'Betina')->select(['id', 'tag', 'type'])->get();

        return Inertia::render('Admin/Breeding', [
            'records' => $records,
            'males' => $males,
            'females' => $females,
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(BreedingStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($data['status'] === 'Pregnant' && empty($data['est_birth_date'])) {
            $data['est_birth_date'] = Carbon::parse($data['mating_date'])->addDays(147)->format('Y-m-d');
        }

        $record = BreedingRecord::create($data);

        if ($data['status'] === 'Pregnant') {
            Sheep::where('id', $data['female_id'])->update(['status' => 'Hamil']);
        }

        $male = Sheep::find($data['male_id']);
        $female = Sheep::find($data['female_id']);
        $this->logActivity('create', 'breeding', $record->id, "Pencatatan pasangan kawin baru: {$male->tag} x {$female->tag}");

        return redirect()->back()->with('success', 'Catatan kawin tersimpan.');
    }

    public function update(BreedingUpdateRequest $request, $id): RedirectResponse
    {
        $record = BreedingRecord::findOrFail($id);
        $data = $request->validated();

        if (($data['status'] ?? null) === 'Pregnant' && empty($data['est_birth_date'])) {
            $data['est_birth_date'] = Carbon::parse($data['mating_date'] ?? $record->mating_date)
                ->addDays(147)
                ->format('Y-m-d');
        }

        $record->update($data);

        $statusMap = [
            'Pregnant' => 'Hamil',
            'Success' => 'Laktasi',
            'Failed' => 'Sehat',
        ];
        if (isset($statusMap[$data['status']]) && $record->female_id) {
            Sheep::where('id', $record->female_id)->update(['status' => $statusMap[$data['status']]]);
        }

        $this->logActivity('update', 'breeding', $record->id, "Update breeding #{$record->id}: {$data['status']}");

        return redirect()->back()->with('success', 'Catatan kawin diperbarui.');
    }

    public function destroy($id): RedirectResponse
    {
        $record = BreedingRecord::findOrFail($id);
        $this->authorize('delete', $record);

        $record->delete();
        $this->logActivity('delete', 'breeding', $id, 'Hapus rekaman breeding');

        return redirect()->back()->with('success', 'Catatan kawin dihapus.');
    }
}
