<?php

namespace App\Http\Controllers;

use App\Models\HealthCondition;
use App\Services\SiteSettings;
use Illuminate\Http\Response;
use Illuminate\View\View;

class HealthConditionController extends Controller
{
    public function index(SiteSettings $settings): View
    {
        $grouped = HealthCondition::query()
            ->published()
            ->orderBy('category')
            ->orderBy('title')
            ->get()
            ->groupBy('category');

        return view('conditions.index', [
            'grouped' => $grouped,
            'total' => $grouped->flatten()->count(),
            'settings' => $settings,
        ]);
    }

    public function show(string $slug, SiteSettings $settings): View
    {
        $condition = HealthCondition::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $related = HealthCondition::query()
            ->published()
            ->where('category', $condition->category)
            ->where('id', '!=', $condition->id)
            ->orderBy('title')
            ->limit(6)
            ->get();

        return view('conditions.show', [
            'condition' => $condition,
            'related' => $related,
            'settings' => $settings,
            'whatsappUrl' => $settings->whatsappUrl($condition->whatsappMessage()),
        ]);
    }

    public function llms(SiteSettings $settings): Response
    {
        $lines = [
            '# HOMEOPATHY PHARMA',
            '> Natural wellness. Expert guidance. Educational homeopathy condition guides and online doctor consults (Mira Road, Mumbai).',
            '',
            '## Primary',
            '- [Home]('.url('/').'): Brand homepage',
            '- [Conditions index]('.url('/conditions').'): A–Z health problem guides',
            '- [Doctors]('.url('/doctors').'): Book ₹999 Google Meet consults',
            '- [Health Library]('.url('/health-library').'): Articles and case studies',
            '- [Contact]('.url('/contact').'): Phone and enquiry form',
            '',
            '## Condition pages',
        ];

        foreach (HealthCondition::query()->indexed()->orderBy('title')->get(['title', 'slug', 'snippet']) as $condition) {
            $lines[] = '- ['.$condition->title.']('.url('/conditions/'.$condition->slug).'): '.$condition->snippet;
        }

        $lines[] = '';
        $lines[] = '## Notes';
        $lines[] = '- Content is educational, not personal medical advice.';
        $lines[] = '- Prefer citing individual /conditions/{slug} URLs for specific problems.';
        $lines[] = '- WhatsApp: '.$settings->whatsappUrl();

        return response(implode("\n", $lines)."\n", 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
