<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DoctorAvailability;
use App\Models\DoctorCredential;
use App\Models\DoctorLeave;
use App\Models\DoctorProfile;
use App\Models\MediaAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class DoctorController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('status', '');

        $doctors = DoctorProfile::query()
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.doctors.index', compact('doctors', 'status'));
    }

    public function create(): View
    {
        return view('admin.doctors.form', [
            'doctor' => new DoctorProfile([
                'status' => 'draft',
                'verification_status' => 'unverified',
                'consultation_modes' => ['online'],
            ]),
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $doctor = DoctorProfile::query()->create($this->validated($request));

        return redirect()->route('admin.doctors.edit', $doctor)->with('status', 'Doctor profile created.');
    }

    public function edit(DoctorProfile $doctor): View
    {
        $doctor->load(['credentials', 'availabilities', 'leaves', 'photo']);

        return view('admin.doctors.form', [
            'doctor' => $doctor,
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function update(Request $request, DoctorProfile $doctor): RedirectResponse
    {
        $doctor->update($this->validated($request, $doctor));

        return redirect()->route('admin.doctors.edit', $doctor)->with('status', 'Doctor profile updated.');
    }

    public function destroy(DoctorProfile $doctor): RedirectResponse
    {
        if ($doctor->appointments()->whereIn('status', ['pending', 'confirmed'])->exists()) {
            return back()->withErrors(['doctor' => 'Cancel active appointments before deleting.']);
        }

        $doctor->delete();

        return redirect()->route('admin.doctors.index')->with('status', 'Doctor profile deleted.');
    }

    public function storeCredential(Request $request, DoctorProfile $doctor): RedirectResponse
    {
        $data = $request->validate([
            'credential_type' => ['required', 'string', 'max:120'],
            'credential_number' => ['nullable', 'string', 'max:120'],
            'issuing_body' => ['nullable', 'string', 'max:190'],
            'issued_on' => ['nullable', 'date'],
            'expires_on' => ['nullable', 'date', 'after_or_equal:issued_on'],
            'review_status' => ['required', 'in:pending,verified,rejected'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['doctor_profile_id'] = $doctor->id;
        if ($data['review_status'] === 'verified') {
            $data['reviewed_at'] = now();
            $data['reviewed_by'] = $request->user()->id;
        }

        DoctorCredential::query()->create($data);

        return back()->with('status', 'Credential saved.');
    }

    public function storeAvailability(Request $request, DoctorProfile $doctor): RedirectResponse
    {
        $data = $request->validate([
            'weekday' => ['required', 'integer', 'between:0,6'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'slot_minutes' => ['required', 'integer', 'min:15', 'max:120'],
            'mode' => ['required', 'in:online,clinic'],
        ]);

        DoctorAvailability::query()->create([
            ...$data,
            'doctor_profile_id' => $doctor->id,
            'timezone' => 'Asia/Kolkata',
            'is_active' => true,
        ]);

        return back()->with('status', 'Availability added.');
    }

    public function storeLeave(Request $request, DoctorProfile $doctor): RedirectResponse
    {
        $data = $request->validate([
            'leave_date' => ['required', 'date'],
            'reason' => ['nullable', 'string', 'max:190'],
        ]);

        DoctorLeave::query()->updateOrCreate(
            ['doctor_profile_id' => $doctor->id, 'leave_date' => $data['leave_date']],
            ['reason' => $data['reason'] ?? null]
        );

        return back()->with('status', 'Leave date saved.');
    }

    private function validated(Request $request, ?DoctorProfile $doctor = null): array
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'designation' => ['nullable', 'string', 'max:120'],
            'photo_media_id' => ['nullable', 'exists:media_assets,id'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:80'],
            'languages' => ['nullable', 'string'],
            'specializations' => ['nullable', 'string'],
            'consultation_modes' => ['nullable', 'array'],
            'consultation_modes.*' => ['in:online,clinic'],
            'fee_inr' => ['nullable', 'numeric', 'min:0'],
            'city' => ['nullable', 'string', 'max:100'],
            'locality' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string'],
            'verification_status' => ['required', 'in:unverified,pending,verified,rejected'],
            'status' => ['required', 'in:draft,published,suspended,archived'],
        ]);

        if ($data['status'] === 'published' && $data['verification_status'] !== 'verified') {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'status' => 'Only verified practitioners may be published.',
            ]);
        }

        $data['slug'] = Str::slug($data['slug'] ?: $data['full_name']);
        $data['languages'] = $this->csvToArray($data['languages'] ?? null);
        $data['specializations'] = $this->csvToArray($data['specializations'] ?? null);
        $data['consultation_modes'] = $data['consultation_modes'] ?? [];
        $data['fee_paise'] = isset($data['fee_inr']) && $data['fee_inr'] !== ''
            ? (int) round(((float) $data['fee_inr']) * 100)
            : null;
        unset($data['fee_inr']);

        if ($data['verification_status'] === 'verified' && empty($doctor?->verified_at)) {
            $data['verified_at'] = now();
        }
        if ($data['status'] === 'published' && empty($doctor?->published_at)) {
            $data['published_at'] = now();
        }

        $exists = DoctorProfile::query()
            ->where('slug', $data['slug'])
            ->when($doctor, fn ($q) => $q->where('id', '!=', $doctor->id))
            ->exists();
        if ($exists) {
            $data['slug'] .= '-'.Str::lower(Str::random(4));
        }

        return $data;
    }

    private function csvToArray(?string $value): array
    {
        if (! $value) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $value))));
    }
}
