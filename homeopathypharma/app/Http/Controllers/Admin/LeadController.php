<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LeadController extends Controller
{
    public function index(Request $request): View
    {
        $status = (string) $request->query('status', 'new');
        $source = (string) $request->query('source', '');

        $leads = ContactMessage::query()
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->when($source !== '', fn ($q) => $q->where('source', $source))
            ->latest()
            ->paginate(30)
            ->withQueryString();

        return view('admin.leads.index', [
            'leads' => $leads,
            'status' => $status,
            'source' => $source,
            'newCount' => ContactMessage::query()->where('status', 'new')->count(),
        ]);
    }

    public function show(ContactMessage $lead): View
    {
        return view('admin.leads.show', compact('lead'));
    }

    public function update(Request $request, ContactMessage $lead): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,reviewed,archived'],
        ]);

        $lead->update(['status' => $data['status']]);

        return back()->with('status', 'Lead updated.');
    }
}
