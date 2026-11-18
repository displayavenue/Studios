<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use RuntimeException;

/**
 * Authoritative Health Explorer catalogue.
 *
 * Live edits live in storage and are published to public paths for the API.
 * Seed data is only used when the live catalogue is missing — never to overwrite
 * admin changes during deploys or code updates.
 */
class HealthExplorerCatalog
{
    public function path(): string
    {
        return storage_path('app/health-explorer/catalog.json');
    }

    public function seedPath(): string
    {
        return storage_path('app/health-explorer/catalog.seed.json');
    }

    public function publicPath(): string
    {
        return public_path('data/health-explorer/catalog.json');
    }

    public function get(): array
    {
        $this->ensureLiveCatalog();

        $path = $this->path();
        if (! File::exists($path)) {
            throw new RuntimeException('Health explorer catalogue is not available.');
        }

        $catalog = json_decode(File::get($path), true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($catalog)) {
            throw new RuntimeException('Health explorer catalogue is invalid.');
        }

        if ($this->ensureSystemShape($catalog)) {
            $this->save($catalog);
        }

        return $catalog;
    }

    public function save(array $catalog): void
    {
        $catalog['updated_at'] = now()->toDateString();
        $json = json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new RuntimeException('Unable to encode health explorer catalogue.');
        }
        $json .= "\n";

        File::ensureDirectoryExists(dirname($this->path()));
        File::put($this->path(), $json);

        // Publish for the public API / static dual-tree hosts — never the reverse.
        $this->publish($json);
    }

    /**
     * Create the live catalogue from seed once. Never clobber an existing live file.
     */
    public function ensureLiveCatalog(): void
    {
        if (File::exists($this->path())) {
            return;
        }

        File::ensureDirectoryExists(dirname($this->path()));

        if (File::exists($this->seedPath())) {
            File::copy($this->seedPath(), $this->path());

            return;
        }

        // Legacy fallback: copy public catalogue into storage once.
        if (File::exists($this->publicPath())) {
            File::copy($this->publicPath(), $this->path());
        }
    }

    /**
     * Fill missing system fields only (never overwrite admin-authored values).
     */
    public function ensureSystemShape(array &$catalog): bool
    {
        $changed = false;
        if (! isset($catalog['systems']) || ! is_array($catalog['systems'])) {
            $catalog['systems'] = [];
            $changed = true;
        }

        foreach ($catalog['systems'] as $index => $system) {
            if (! is_array($system)) {
                continue;
            }
            $id = (string) ($system['id'] ?? '');
            $defaults = $this->systemDefaultsFor($id);
            foreach ($defaults as $key => $value) {
                if (! array_key_exists($key, $system) || $system[$key] === null || $system[$key] === '') {
                    $catalog['systems'][$index][$key] = $value;
                    $changed = true;
                    $system[$key] = $value;
                }
            }

            // Nested overlays: only fill missing gender/view paths.
            $overlays = is_array($system['overlays'] ?? null) ? $system['overlays'] : [];
            $defaultOverlays = $defaults['overlays'] ?? [];
            foreach ($defaultOverlays as $gender => $views) {
                if (! isset($overlays[$gender]) || ! is_array($overlays[$gender])) {
                    $overlays[$gender] = [];
                    $changed = true;
                }
                foreach ($views as $view => $path) {
                    if (empty($overlays[$gender][$view])) {
                        $overlays[$gender][$view] = $path;
                        $changed = true;
                    }
                }
            }
            $catalog['systems'][$index]['overlays'] = $overlays;
        }

        return $changed;
    }

    private function systemDefaultsFor(string $id): array
    {
        $base = [
            'summary' => '',
            'function' => '',
            'description' => '',
            'symptoms' => [],
            'causes' => [],
            'treatments' => [],
            'specialists' => [],
            'prevention' => [],
            'seo_title' => null,
            'seo_description' => null,
            'sort_order' => 100,
            'enabled' => true,
            'overlay_mode' => 'none',
            'overlays' => [],
        ];

        if ($id === 'cardiovascular') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/cardiovascular-female-front-v6.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/cardiovascular-male-front-v6.webp',
                ],
            ];
        }

        if ($id === 'respiratory') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/respiratory-female-front-v1.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/respiratory-male-front-v1.webp',
                ],
            ];
        }

        if ($id === 'digestive') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/digestive-female-front-v1.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/digestive-male-front-v1.webp',
                ],
            ];
        }

        if ($id === 'nervous') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/nervous-female-front-v1.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/nervous-male-front-v1.webp',
                ],
            ];
        }

        if ($id === 'musculoskeletal') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/musculoskeletal-female-front-v1.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/musculoskeletal-male-front-v1.webp',
                ],
            ];
        }

        if ($id === 'endocrine') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/endocrine-female-front-v1.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/endocrine-male-front-v1.webp',
                ],
            ];
        }

        if ($id === 'urinary') {
            $base['overlay_mode'] = 'full_figure';
            $base['overlays'] = [
                'female' => [
                    'front' => '/images/health-explorer/overlays/urinary-female-front-v1.webp',
                ],
                'male' => [
                    'front' => '/images/health-explorer/overlays/urinary-male-front-v1.webp',
                ],
            ];
        }

        return $base;
    }

    private function publish(string $json): void
    {
        File::ensureDirectoryExists(dirname($this->publicPath()));
        File::put($this->publicPath(), $json);

        $mirror = base_path('../public_html/data/health-explorer/catalog.json');
        if (is_dir(dirname($mirror))) {
            @File::put($mirror, $json);
        }
    }
}
