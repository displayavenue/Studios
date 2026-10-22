<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\AppointmentBookingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AppointmentController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('status', '');

        $appointments = Appointment::query()
            ->with('doctor')
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->latest('starts_at')
            ->paginate(20)
            ->withQueryString();

        return view('admin.appointments.index', compact('appointments', 'status'));
    }

    public function show(Appointment $appointment): View
    {
        $appointment->load('doctor');

        return view('admin.appointments.show', compact('appointment'));
    }

    public function update(Request $request, Appointment $appointment, AppointmentBookingService $booking): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,cancelled,completed,rescheduled'],
            'cancellation_reason' => ['nullable', 'string', 'max:255'],
        ]);

        if ($data['status'] === 'cancelled') {
            $booking->cancel($appointment, $data['cancellation_reason'] ?? null);
        } else {
            $appointment->update(['status' => $data['status']]);
        }

        return back()->with('status', 'Appointment updated.');
    }
}
