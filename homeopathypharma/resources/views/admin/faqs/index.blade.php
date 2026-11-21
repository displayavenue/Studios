@extends('layouts.admin')
@section('title', "FAQ's")
@section('content')
<div class="admin-top">
    <div>
        <h2>FAQ's</h2>
        <p class="admin-muted" style="margin:0.35rem 0 0;">Knowledge Centre FAQ entries. Edit answers, leave blank for “coming soon”, draft, publish, or delete anytime.</p>
    </div>
    <a class="btn btn-primary" href="{{ route('admin.faqs.create') }}">Add FAQ</a>
</div>
<div class="admin-card">
    <table class="admin-table">
        <thead>
            <tr>
                <th>Order</th>
                <th>Category</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Status</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @forelse ($entries as $entry)
                <tr>
                    <td>{{ $entry->sort_order }}</td>
                    <td>{{ $entry->category }}</td>
                    <td>{{ \Illuminate\Support\Str::limit($entry->question, 70) }}</td>
                    <td>
                        @if ($entry->hasAnswer())
                            {{ \Illuminate\Support\Str::limit($entry->answer, 60) }}
                        @else
                            <span class="admin-muted">— blank</span>
                        @endif
                    </td>
                    <td><span class="badge">{{ $entry->status }}</span></td>
                    <td class="admin-actions">
                        <a href="{{ route('admin.faqs.edit', $entry) }}">Edit</a>
                        <form method="post" action="{{ route('admin.faqs.destroy', $entry) }}" onsubmit="return confirm('Delete this FAQ?');">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger" type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="6">No FAQs yet. <a href="{{ route('admin.faqs.create') }}">Add the first one</a>.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
{{ $entries->links() }}
<p class="admin-muted" style="margin-top:1rem;">Public page: <a href="{{ route('faqs') }}" target="_blank" rel="noopener">{{ url('/faqs') }}</a></p>
@endsection
