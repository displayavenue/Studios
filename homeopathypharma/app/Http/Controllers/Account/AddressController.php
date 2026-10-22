<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AddressController extends Controller
{
    public function index(Request $request): View
    {
        return view('account.addresses', [
            'addresses' => $request->user()->addresses()->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['user_id'] = $request->user()->id;

        if ($data['is_default']) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        CustomerAddress::query()->create($data);

        return back()->with('status', 'Address saved.');
    }

    public function destroy(Request $request, CustomerAddress $address): RedirectResponse
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        $address->delete();

        return back()->with('status', 'Address removed.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'label' => ['nullable', 'string', 'max:50'],
            'full_name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'line1' => ['required', 'string', 'max:190'],
            'line2' => ['nullable', 'string', 'max:190'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'size:2'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $data['country'] = $data['country'] ?? 'IN';
        $data['is_default'] = $request->boolean('is_default');

        return $data;
    }
}
