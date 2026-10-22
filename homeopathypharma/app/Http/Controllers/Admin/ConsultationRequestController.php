<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsultationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ConsultationRequestController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('status', '');

        $requests = ConsultationRequest::query()
            ->with('doctor')
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(25)
            ->withQueryString();

        return view('admin.consultations.index', compact('requests', 'status'));
    }

    public function show(ConsultationRequest $consultation): View
    {
        $consultation->load('doctor');

        return view('admin.consultations.show', ['consultation' => $consultation]);
    }

    public function update(Request $request, ConsultationRequest $consultation): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,contacted,scheduled,completed,cancelled'],
            'meeting_url' => ['nullable', 'url', 'max:500'],
            'scheduled_at' => ['nullable', 'date'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $consultation->update($data);

        return back()->with('status', 'Consultation request updated.');
    }
}
