@extends('layouts.admin')
@section('title', "FAQ's")
@section('content')
<div class="admin-top">
    <div>
        <h2>FAQ's</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Edit any fields below, then click <strong>Save all changes</strong>. The page will blink green when everything is saved.</p>
    </div>
    <div class="admin-actions" style="gap:0.5rem;">
        <a class="btn btn-secondary" href="{{ route('admin.faqs.create') }}">Add FAQ</a>
        <button class="btn btn-primary" type="submit" form="faq-bulk-form">Save all changes</button>
    </div>
</div>

<form id="faq-bulk-form" method="post" action="{{ route('admin.faqs.bulk') }}" class="admin-faq-bulk">
    @csrf
    @method('PUT')

    @forelse ($entries as $index => $entry)
        <article class="admin-card admin-faq-bulk__card">
            <input type="hidden" name="faqs[{{ $index }}][id]" value="{{ $entry->id }}">
            <div class="admin-faq-bulk__meta">
                <label>Order
                    <input type="number" min="0" name="faqs[{{ $index }}][sort_order]" value="{{ old('faqs.'.$index.'.sort_order', $entry->sort_order) }}">
                </label>
                <label>Category
                    <select name="faqs[{{ $index }}][category]" required>
                        @foreach (\App\Models\Faq::CATEGORIES as $category)
                            <option value="{{ $category }}" @selected(old('faqs.'.$index.'.category', $entry->category) === $category)>{{ $category }}</option>
                        @endforeach
                    </select>
                </label>
                <label>Status
                    <select name="faqs[{{ $index }}][status]" required>
                        @foreach (['draft', 'published', 'archived'] as $status)
                            <option value="{{ $status }}" @selected(old('faqs.'.$index.'.status', $entry->status) === $status)>{{ $status }}</option>
                        @endforeach
                    </select>
                </label>
            </div>
            <label>Question
                <input name="faqs[{{ $index }}][question]" value="{{ old('faqs.'.$index.'.question', $entry->question) }}" required maxlength="255">
            </label>
            <label>Answer <span class="admin-muted">(leave blank for no answer; use Guide: / 1. Title for step guides)</span>
                <textarea name="faqs[{{ $index }}][answer]" rows="6" maxlength="5000">{{ old('faqs.'.$index.'.answer', $entry->answer) }}</textarea>
            </label>
            <div class="admin-actions">
                <a href="{{ route('admin.faqs.edit', $entry) }}">Open single editor</a>
                <button class="btn btn-danger" type="submit" form="faq-delete-{{ $entry->id }}" onclick="return confirm('Delete this FAQ?');">Delete</button>
            </div>
        </article>
    @empty
        <div class="admin-card">
            <p>No FAQs yet. <a href="{{ route('admin.faqs.create') }}">Add the first one</a>.</p>
        </div>
    @endforelse

    @if ($entries->isNotEmpty())
        <div class="admin-faq-bulk__footer">
            <button class="btn btn-primary" type="submit">Save all changes</button>
            <p class="admin-muted" style="margin:0;">Public page: <a href="{{ route('faqs') }}" target="_blank" rel="noopener">{{ url('/faqs') }}</a></p>
        </div>
    @endif
</form>

@foreach ($entries as $entry)
    <form id="faq-delete-{{ $entry->id }}" method="post" action="{{ route('admin.faqs.destroy', $entry) }}" hidden>
        @csrf
        @method('DELETE')
    </form>
@endforeach
@endsection

@push('styles')
<style>
.admin-faq-bulk { display:grid; gap:1rem; }
.admin-faq-bulk__card { display:grid; gap:0.85rem; }
.admin-faq-bulk__card label { display:grid; gap:0.3rem; font-weight:600; font-size:0.9rem; }
.admin-faq-bulk__card input,
.admin-faq-bulk__card select,
.admin-faq-bulk__card textarea {
  width:100%;
  font-weight:500;
}
.admin-faq-bulk__meta {
  display:grid;
  grid-template-columns: 7rem minmax(12rem,1.4fr) 9rem;
  gap:0.75rem;
}
.admin-faq-bulk__footer {
  position:sticky;
  bottom:0.75rem;
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:0.85rem;
  padding:0.85rem 1rem;
  background:#fff;
  border:1px solid var(--ad-border);
  border-radius:0.65rem;
  box-shadow:0 8px 24px rgba(15, 40, 32, 0.08);
  z-index:5;
}
@media (max-width: 800px) {
  .admin-faq-bulk__meta { grid-template-columns:1fr; }
}
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
  let flash = document.getElementById('admin-save-flash');
  if (!flash) {
    flash = document.createElement('div');
    flash.id = 'admin-save-flash';
    flash.className = 'admin-save-flash';
    flash.setAttribute('aria-hidden', 'true');
    document.body.appendChild(flash);
  }

  function blinkPageSaved() {
    flash.style.transition = 'none';
    flash.style.opacity = '0';
    void flash.offsetWidth;
    flash.style.transition = 'opacity 120ms ease-out';
    flash.style.opacity = '0.5';
    window.setTimeout(() => {
      flash.style.transition = 'opacity 320ms ease-out';
      flash.style.opacity = '0';
    }, 260);
  }

  if (shouldBlink) {
    blinkPageSaved();
  }
})();
</script>
@endpush
