@extends('layouts.admin')
@section('title', $entry->exists ? 'Edit FAQ' : 'Add FAQ')
@section('content')
<div class="admin-top">
    <h2>{{ $entry->exists ? 'Edit' : 'Add' }} FAQ</h2>
</div>
<form method="post" action="{{ $entry->exists ? route('admin.faqs.update', $entry) : route('admin.faqs.store') }}" class="admin-form admin-card">
    @csrf
    @if ($entry->exists)
        @method('PUT')
    @endif
    <label>Category
        <select name="category" required>
            @foreach (\App\Models\Faq::CATEGORIES as $category)
                <option value="{{ $category }}" @selected(old('category', $entry->category) === $category)>{{ $category }}</option>
            @endforeach
        </select>
    </label>
    <label>Question
        <input name="question" value="{{ old('question', $entry->question) }}" required maxlength="255">
    </label>
    <label>Answer <span class="admin-muted">(leave blank for no answer. For a step guide, start with “Guide: …”, then “1. Title” on one line and the detail on the next)</span>
        <textarea name="answer" rows="14" maxlength="5000">{{ old('answer', $entry->answer) }}</textarea>
    </label>
    <label>Sort order
        <input type="number" min="0" name="sort_order" value="{{ old('sort_order', $entry->sort_order ?? 0) }}">
    </label>
    <label>Status
        <select name="status">
            @foreach (['draft', 'published', 'archived'] as $status)
                <option value="{{ $status }}" @selected(old('status', $entry->status) === $status)>{{ $status }}</option>
            @endforeach
        </select>
    </label>
    <div class="admin-actions">
        <button class="btn btn-primary" type="submit">Save changes</button>
        <a class="btn btn-secondary" href="{{ route('admin.faqs.index') }}">Back to all FAQ's</a>
    </div>
</form>
@if ($entry->exists)
    <form method="post" action="{{ route('admin.faqs.destroy', $entry) }}" style="margin-top:1rem;" onsubmit="return confirm('Delete this FAQ permanently?');">
        @csrf
        @method('DELETE')
        <button class="btn btn-danger" type="submit">Delete FAQ</button>
    </form>
@endif
@endsection

@push('styles')
<style>
.admin-save-flash {
  position:fixed; left:0; top:0; right:0; bottom:0;
  width:100vw; height:100vh;
  z-index:2147483646; pointer-events:none;
  background:#0d6b5c;
  opacity:0;
}
</style>
@endpush

@push('scripts')
<script>
(() => {
  const shouldBlink = @json((bool) session('saved_blink'));
  if (!shouldBlink) return;
  let flash = document.getElementById('admin-save-flash');
  if (!flash) {
    flash = document.createElement('div');
    flash.id = 'admin-save-flash';
    flash.className = 'admin-save-flash';
    flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);
  }
  flash.style.transition = 'none';
  flash.style.opacity = '0';
  void flash.offsetWidth;
  flash.style.transition = 'opacity 120ms ease-out';
  flash.style.opacity = '0.5';
  window.setTimeout(() => {
    flash.style.transition = 'opacity 320ms ease-out';
    flash.style.opacity = '0';
  }, 260);
})();
</script>
@endpush
