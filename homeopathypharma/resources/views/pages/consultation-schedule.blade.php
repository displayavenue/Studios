@extends('layouts.app')
@section('title', 'Choose consultation slot — '.$settings->brandName())
@section('content')
@php
    $minDate = $days[0]['value'];
    $maxDate = $days[count($days) - 1]['value'];
    $allowedDates = collect($days)->pluck('value')->values();
    $slotMeta = collect($timeSlots)->map(function ($slot) {
        $c = \Carbon\Carbon::createFromFormat('H:i', $slot, 'Asia/Kolkata');

        return [
            'value' => $slot,
            'label' => $c->format('g:i A'),
            'hour12' => (int) $c->format('g'),
            'hour24' => (int) $c->format('G'),
        ];
    })->values();
@endphp
<section class="hp-page">
<div class="hp-container" style="max-width:28rem;">
<p class="hp-breadcrumb"><a href="{{ route('home') }}">Home</a> · Choose slot</p>
<h1>Choose your preferred slot</h1>
@if(session('status'))<div class="hp-status">{{ session('status') }}</div>@endif
<p class="hp-section__lead">Pick a day on the calendar (today through {{ $days[count($days)-1]['label'] }}). Then set the time on the clock. Fee: <strong>{{ $feeDisplay }}</strong>.</p>

<div class="hp-form" style="margin:1rem 0 1.25rem;">
<p><strong>Reference</strong> {{ $consultation->number }}</p>
@if($consultation->doctor)
<p><strong>Doctor</strong> {{ $consultation->doctor->full_name }}</p>
@endif
<p><strong>Patient</strong> {{ $consultation->patient_name }} · {{ $consultation->patient_phone }}</p>
</div>

<form method="post" action="{{ route('consultations.schedule.save', $consultation) }}" class="hp-form hp-consult-schedule" id="consult-schedule-form">
@csrf
<input type="hidden" name="preferred_date" id="preferred_date" value="{{ old('preferred_date') }}" required>
<input type="hidden" name="preferred_time" id="preferred_time" value="{{ old('preferred_time') }}" required>

<p class="hp-consult-schedule__label">Date</p>
@error('preferred_date')<p class="hp-status" role="alert">{{ $message }}</p>@enderror
<div class="hp-cal" data-cal data-min="{{ $minDate }}" data-max="{{ $maxDate }}" data-allowed='@json($allowedDates)'>
    <div class="hp-cal__head">
        <button type="button" class="hp-cal__nav" data-cal-prev aria-label="Previous month">‹</button>
        <p class="hp-cal__title" data-cal-title></p>
        <button type="button" class="hp-cal__nav" data-cal-next aria-label="Next month">›</button>
    </div>
    <div class="hp-cal__weekdays" aria-hidden="true">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
    </div>
    <div class="hp-cal__grid" data-cal-grid role="grid" aria-label="Choose consultation date"></div>
    <p class="hp-cal__picked" data-cal-picked>Select a date on the calendar.</p>
</div>

<div class="hp-clock-wrap" data-clock-wrap hidden>
    <p class="hp-consult-schedule__label">Time <span class="hp-muted">(IST)</span></p>
    @error('preferred_time')<p class="hp-status" role="alert">{{ $message }}</p>@enderror
    <div class="hp-clock" data-clock data-slots='@json($slotMeta)'>
        <div class="hp-clock__face" data-clock-face>
            <span class="hp-clock__center" aria-hidden="true"></span>
            <span class="hp-clock__hand" data-clock-hand aria-hidden="true"></span>
        </div>
        <p class="hp-clock__picked" data-clock-picked>Tap an hour on the clock.</p>
        <div class="hp-clock__list" data-clock-list role="listbox" aria-label="Preferred time"></div>
    </div>
</div>

<button class="hp-btn hp-btn--primary" type="submit" style="margin-top:1.5rem;width:100%;" data-submit disabled>Continue to payment</button>
</form>
</div>
</section>

<style>
.hp-consult-schedule__label{font-weight:600;margin:0 0 .65rem;color:var(--hp-ink,#1a2e1a);}
.hp-cal{border:1.5px solid rgba(26,58,42,.16);border-radius:1rem;background:#fff;padding:.85rem .9rem 1rem;box-shadow:0 8px 24px rgba(26,58,42,.06);}
.hp-cal__head{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.75rem;}
.hp-cal__title{margin:0;font-weight:700;color:var(--hp-forest,#1a3a2a);font-size:1.05rem;}
.hp-cal__nav{width:2.2rem;height:2.2rem;border-radius:999px;border:1.5px solid rgba(26,58,42,.18);background:#fff;color:var(--hp-forest,#1a3a2a);font-size:1.35rem;line-height:1;cursor:pointer;}
.hp-cal__nav:disabled{opacity:.35;cursor:not-allowed;}
.hp-cal__weekdays,.hp-cal__grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:.25rem;}
.hp-cal__weekdays span{text-align:center;font-size:.72rem;font-weight:600;color:#6a7a6a;padding:.25rem 0;}
.hp-cal__day{appearance:none;border:0;background:transparent;border-radius:.65rem;aspect-ratio:1;font:inherit;font-weight:600;color:var(--hp-forest,#1a3a2a);cursor:pointer;}
.hp-cal__day:hover:not(:disabled){background:rgba(26,58,42,.08);}
.hp-cal__day.is-outside,.hp-cal__day:disabled{color:#b7c0b7;cursor:default;font-weight:500;}
.hp-cal__day.is-selected{background:var(--hp-forest,#1a3a2a);color:#fff;}
.hp-cal__day.is-today:not(.is-selected){box-shadow:inset 0 0 0 1.5px var(--hp-forest,#1a3a2a);}
.hp-cal__picked{margin:.75rem 0 0;font-size:.92rem;color:#3d4f3d;}
.hp-clock-wrap{margin-top:1.35rem;animation:hpClockIn .28s ease;}
@keyframes hpClockIn{from{opacity:0;transform:translateY(.4rem)}to{opacity:1;transform:none}}
.hp-clock{border:1.5px solid rgba(26,58,42,.16);border-radius:1rem;background:#fff;padding:1rem;box-shadow:0 8px 24px rgba(26,58,42,.06);}
.hp-clock__face{position:relative;width:min(100%,16.5rem);aspect-ratio:1;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 50% 45%,#f7faf7 0%,#eef4ef 62%,#e4ede5 100%);border:1.5px solid rgba(26,58,42,.14);box-shadow:inset 0 0 0 10px rgba(255,255,255,.55);}
.hp-clock__center{position:absolute;left:50%;top:50%;width:.7rem;height:.7rem;margin:-.35rem 0 0 -.35rem;border-radius:50%;background:var(--hp-forest,#1a3a2a);z-index:3;}
.hp-clock__hand{position:absolute;left:50%;top:50%;width:2.5px;height:32%;margin-top:-32%;transform-origin:50% 100%;background:var(--hp-forest,#1a3a2a);border-radius:2px;opacity:0;transition:transform .2s ease,opacity .15s ease;z-index:2;}
.hp-clock__hand.is-on{opacity:1;}
.hp-clock__hour{position:absolute;left:var(--left);top:var(--top);width:2.55rem;height:2.55rem;margin:-1.275rem 0 0 -1.275rem;border-radius:50%;border:0;background:#fff;color:var(--hp-forest,#1a3a2a);font:inherit;font-weight:700;font-size:.95rem;cursor:pointer;box-shadow:0 2px 8px rgba(26,58,42,.12);z-index:4;}
.hp-clock__hour:hover,.hp-clock__hour:focus-visible{outline:2px solid var(--hp-forest,#1a3a2a);outline-offset:2px;}
.hp-clock__hour.is-selected{background:var(--hp-forest,#1a3a2a);color:#fff;}
.hp-clock__picked{margin:.85rem 0 .55rem;text-align:center;font-weight:600;color:var(--hp-forest,#1a3a2a);}
.hp-clock__list{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem;}
.hp-clock__chip{appearance:none;border:1.5px solid rgba(26,58,42,.16);background:#fff;color:var(--hp-forest,#1a3a2a);border-radius:999px;padding:.35rem .7rem;font:inherit;font-size:.82rem;font-weight:600;cursor:pointer;}
.hp-clock__chip.is-selected{background:var(--hp-forest,#1a3a2a);border-color:var(--hp-forest,#1a3a2a);color:#fff;}
</style>

<script>
(function () {
  var form = document.getElementById('consult-schedule-form');
  if (!form) return;

  var dateInput = document.getElementById('preferred_date');
  var timeInput = document.getElementById('preferred_time');
  var submitBtn = form.querySelector('[data-submit]');
  var cal = form.querySelector('[data-cal]');
  var clockWrap = form.querySelector('[data-clock-wrap]');
  var clock = form.querySelector('[data-clock]');
  var allowed = JSON.parse(cal.getAttribute('data-allowed') || '[]');
  var min = cal.getAttribute('data-min');
  var max = cal.getAttribute('data-max');
  var slots = JSON.parse(clock.getAttribute('data-slots') || '[]');
  var titleEl = cal.querySelector('[data-cal-title]');
  var gridEl = cal.querySelector('[data-cal-grid]');
  var pickedEl = cal.querySelector('[data-cal-picked]');
  var prevBtn = cal.querySelector('[data-cal-prev]');
  var nextBtn = cal.querySelector('[data-cal-next]');
  var face = clock.querySelector('[data-clock-face]');
  var hand = clock.querySelector('[data-clock-hand]');
  var clockPicked = clock.querySelector('[data-clock-picked]');
  var clockList = clock.querySelector('[data-clock-list]');

  function parseYmd(s) {
    var p = s.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function ymd(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function sameMonth(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); }
  function fmtLong(s) {
    return parseYmd(s).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  var view = parseYmd(dateInput.value && allowed.indexOf(dateInput.value) !== -1 ? dateInput.value : min);
  view = new Date(view.getFullYear(), view.getMonth(), 1);
  var minD = parseYmd(min);
  var maxD = parseYmd(max);

  function syncSubmit() {
    submitBtn.disabled = !(dateInput.value && timeInput.value);
  }

  function renderCal() {
    titleEl.textContent = view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    prevBtn.disabled = sameMonth(view, minD) || view <= new Date(minD.getFullYear(), minD.getMonth(), 1);
    nextBtn.disabled = sameMonth(view, maxD) || view >= new Date(maxD.getFullYear(), maxD.getMonth(), 1);
    gridEl.innerHTML = '';
    var first = new Date(view.getFullYear(), view.getMonth(), 1);
    var startPad = first.getDay();
    var start = new Date(first);
    start.setDate(1 - startPad);
    for (var i = 0; i < 42; i++) {
      var day = new Date(start);
      day.setDate(start.getDate() + i);
      var value = ymd(day);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hp-cal__day';
      btn.textContent = String(day.getDate());
      btn.setAttribute('role', 'gridcell');
      var outside = !sameMonth(day, view);
      var enabled = allowed.indexOf(value) !== -1;
      if (outside) btn.classList.add('is-outside');
      if (value === ymd(new Date())) btn.classList.add('is-today');
      if (dateInput.value === value) btn.classList.add('is-selected');
      if (!enabled) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', function (v) {
          return function () { selectDate(v); };
        }(value));
      }
      gridEl.appendChild(btn);
    }
  }

  function selectDate(value) {
    dateInput.value = value;
    pickedEl.textContent = 'Selected date: ' + fmtLong(value);
    clockWrap.hidden = false;
    renderCal();
    syncSubmit();
  }

  function placeHours() {
    face.querySelectorAll('.hp-clock__hour').forEach(function (n) { n.remove(); });
      var radius = 38; // percent of face
    slots.forEach(function (slot) {
      var angle = (slot.hour12 % 12) / 12 * Math.PI * 2 - Math.PI / 2;
      var left = 50 + Math.cos(angle) * radius;
      var top = 50 + Math.sin(angle) * radius;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hp-clock__hour';
      btn.textContent = String(slot.hour12);
      btn.setAttribute('aria-label', slot.label);
      btn.style.setProperty('--left', left + '%');
      btn.style.setProperty('--top', top + '%');
      if (timeInput.value === slot.value) btn.classList.add('is-selected');
      btn.addEventListener('click', function () { selectTime(slot.value); });
      face.appendChild(btn);
    });

    clockList.innerHTML = '';
    slots.forEach(function (slot) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'hp-clock__chip';
      chip.textContent = slot.label;
      if (timeInput.value === slot.value) chip.classList.add('is-selected');
      chip.addEventListener('click', function () { selectTime(slot.value); });
      clockList.appendChild(chip);
    });
  }

  function selectTime(value) {
    timeInput.value = value;
    var slot = slots.find(function (s) { return s.value === value; });
    if (!slot) return;
    var deg = (slot.hour12 % 12) / 12 * 360;
    hand.style.transform = 'rotate(' + deg + 'deg)';
    hand.classList.add('is-on');
    clockPicked.textContent = 'Selected time: ' + slot.label + ' IST';
    placeHours();
    syncSubmit();
  }

  prevBtn.addEventListener('click', function () {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    renderCal();
  });
  nextBtn.addEventListener('click', function () {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    renderCal();
  });

  placeHours();
  renderCal();

  if (dateInput.value && allowed.indexOf(dateInput.value) !== -1) {
    selectDate(dateInput.value);
    if (timeInput.value) selectTime(timeInput.value);
  }
  syncSubmit();
})();
</script>
@endsection
