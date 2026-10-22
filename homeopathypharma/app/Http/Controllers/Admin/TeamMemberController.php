<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class TeamMemberController extends Controller
{
    public function index(): View
    {
        return view('admin.team.index', [
            'members' => TeamMember::query()->orderBy('sort_order')->orderBy('name')->paginate(20),
        ]);
    }

    public function create(): View
    {
        return view('admin.team.form', [
            'member' => new TeamMember(['status' => 'draft', 'designation' => 'Team member']),
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        TeamMember::query()->create($this->validated($request));

        return redirect()->route('admin.team.index')->with('status', 'Team member created.');
    }

    public function edit(TeamMember $team): View
    {
        return view('admin.team.form', [
            'member' => $team,
            'media' => MediaAsset::query()->latest()->limit(50)->get(),
        ]);
    }

    public function update(Request $request, TeamMember $team): RedirectResponse
    {
        $team->update($this->validated($request, $team));

        return redirect()->route('admin.team.index')->with('status', 'Team member updated.');
    }

    public function destroy(TeamMember $team): RedirectResponse
    {
        $team->delete();

        return redirect()->route('admin.team.index')->with('status', 'Team member deleted.');
    }

    private function validated(Request $request, ?TeamMember $member = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190'],
            'designation' => ['required', 'string', 'max:120'],
            'photo_media_id' => ['nullable', 'exists:media_assets,id'],
            'biography' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'qualifications' => ['nullable', 'string'],
            'link_url' => ['nullable', 'url', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'in:draft,published,archived'],
            'started_on' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:190'],
            'seo_description' => ['nullable', 'string', 'max:500'],
        ]);

        $data['slug'] = Str::slug($data['slug'] ?: $data['name']);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        if ($data['status'] === 'published' && empty($member?->published_at)) {
            $data['published_at'] = now();
        }

        $exists = TeamMember::query()
            ->where('slug', $data['slug'])
            ->when($member, fn ($q) => $q->where('id', '!=', $member->id))
            ->exists();

        if ($exists) {
            $data['slug'] .= '-'.Str::lower(Str::random(4));
        }

        return $data;
    }
}
