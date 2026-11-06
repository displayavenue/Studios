<?php

namespace App\Console\Commands;

use App\Services\MediaUploader;
use Illuminate\Console\Command;

class PublishMediaUploads extends Command
{
    protected $signature = 'media:publish-uploads';

    protected $description = 'Copy media library files into public/uploads so Hostinger can serve them without storage symlinks';

    public function handle(MediaUploader $uploader): int
    {
        $count = $uploader->publishAll();
        $this->info("Published {$count} media file(s) to public/uploads.");

        return self::SUCCESS;
    }
}
