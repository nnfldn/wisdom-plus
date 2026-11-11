<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\TransformsSheep;
use App\Http\Controllers\Controller;
use App\Http\Requests\MedicalRecordStoreRequest;
use App\Models\MedicalRecord;
use App\Models\Sheep;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MedicalController extends Controller
{
    use LogsActivity, TransformsSheep;

    public function index(): Response
    {
        $sickSheep = Sheep::with(['medicalRecords' => fn ($q) => $q->orderBy('handled_at', 'desc')])
            ->where('status', 'Sakit')
            ->paginate(10);

        return Inertia::render('Admin/Medical', [
            'sickSheep' => $sickSheep->through(fn ($s) => array_merge(
                $this->transformSheep($s),
                ['medical_history' => $s->medicalRecords]
            )),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(MedicalRecordStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        MedicalRecord::create([
            'sheep_id' => $data['sheep_id'],
            'diagnosis' => $data['diagnosis'],
            'treatment' => $data['treatment'],
            'notes' => $data['notes'] ?? null,
            'handled_at' => $data['handled_at'],
        ]);

        $sheep = Sheep::findOrFail($data['sheep_id']);
        if (! empty($data['is_recovered'])) {
            $sheep->update([
                'status' => 'Penggemukan',
                'health' => 'Sehat',
            ]);
            $this->logActivity('update', 'medical', $sheep->tag, "Domba {$sheep->tag} dinyatakan sembuh.");
        } else {
            $sheep->update([
                'status' => 'Sakit',
                'health' => $data['diagnosis'],
            ]);
        }

        return redirect()->back()->with('success', 'Catatan medis tersimpan.');
    }
}
