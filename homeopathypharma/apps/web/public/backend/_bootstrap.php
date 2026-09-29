<?php
declare(strict_types=1);
/**
 * HomeopathyPharma PHP CMS backend for Hostinger shared hosting.
 * Password-gated WordPress-style editor that writes JSON under /cms-data/.
 */

session_start();

const CMS_DIR = __DIR__ . '/../cms-data';
const ADMIN_USER = 'admin@homeopathypharma.com';

function admin_password(): string {
    $env = getenv('HP_ADMIN_PASSWORD');
    if (is_string($env) && $env !== '') {
        return $env;
    }
    // Fallback kept in sync with Next admin default; override via env when possible.
    return 'admin123';
}

function cms_path(string $file): string {
    return CMS_DIR . '/' . $file;
}

function read_json(string $file, $fallback) {
    $path = cms_path($file);
    if (!is_readable($path)) {
        return $fallback;
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : $fallback;
}

function write_json(string $file, $data): bool {
    if (!is_dir(CMS_DIR)) {
        mkdir(CMS_DIR, 0755, true);
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return file_put_contents(cms_path($file), $json . "\n") !== false;
}

function require_login(): void {
    if (!empty($_SESSION['hp_admin'])) {
        return;
    }
    header('Location: /backend/login.php');
    exit;
}

function h(?string $value): string {
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function flash(string $message): void {
    $_SESSION['flash'] = $message;
}

function take_flash(): ?string {
    if (empty($_SESSION['flash'])) {
        return null;
    }
    $msg = (string) $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $msg;
}
