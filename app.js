(function () {
  'use strict';
  var L = window.LitCal, I18N = window.LITCAL_I18N, BIOS = window.LITCAL_BIOS || {}, READINGS = window.LITCAL_READINGS || {}, SC = window.LitScripture;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- settings (remembered on this device only) ---------- */
  function load(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode: not remembered */ } }
  var lang = load('lc.lang', /^es/i.test(navigator.language || '') ? 'es' : 'en');
  if (!I18N[lang]) lang = 'en';
  var ascThu = load('lc.asc', 'sun') === 'thu';
  var S = I18N[lang];
  var current, monthAnchor; // monthAnchor: day number of the 1st of the month shown in the month view

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function getDay(n) { return L.getDay(n, { lang: lang, ascThu: ascThu }); }
  function longDate(d) { return S.date(d, S.months); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- static wording ---------- */
  function renderStatic() {
    S = I18N[lang];
    document.documentElement.lang = lang;
    $('title').textContent = S.title; $('tag').textContent = S.tag;
    $('supportTop').textContent = '♥ ' + S.support;
    $('supportBottom').textContent = '♥ ' + S.supportLong;
    $('supportFine').textContent = S.supportFine;
    $('langBtn').textContent = lang === 'en' ? 'Español' : 'English';
    $('langBtn').setAttribute('lang', lang === 'en' ? 'es' : 'en');
    $('prev').setAttribute('aria-label', S.prevDay); $('next').setAttribute('aria-label', S.nextDay);
    $('date').setAttribute('aria-label', S.pickDate);
    $('prevMonth').setAttribute('aria-label', S.prevMonth); $('nextMonth').setAttribute('aria-label', S.nextMonth);
    $('today').textContent = S.backToday;
    $('readingsTitle').textContent = S.readings; $('saintTitle').textContent = S.saint;
    $('weekTitle').textContent = S.week; $('monthTitle').textContent = S.month;
    $('meaningsTitle').textContent = S.meaningsTitle; $('meaningsSub').textContent = S.meaningsSub;
    $('historyTitle').textContent = S.historyTitle; $('historySub').textContent = S.historySub;
    $('settingsTitle').textContent = S.settings; $('settingsSub').textContent = S.settingsSub;
    $('langLabel').textContent = S.language; $('ascLabel').textContent = S.ascension;
    $('ascSel').options[0].textContent = S.ascSun; $('ascSel').options[1].textContent = S.ascThu;
    $('langSel').value = lang; $('ascSel').value = ascThu ? 'thu' : 'sun';
    $('saintClose').textContent = S.close;
    $('wearNote').textContent = S.wearNote; $('fine').textContent = S.fine;
    $('meanings').innerHTML = S.meanings.map(function (m) {
      return '<li><i data-color="' + m[0] + '"></i><div><b>' + esc(m[1]) + '</b> <em>' + esc(m[2]) + '</em><p>' + esc(m[3]) + '</p></div></li>';
    }).join('');
    // history text is our own trusted wording and contains <i> for book titles
    $('history').innerHTML = S.history.map(function (h) { return '<li><b>' + esc(h[0]) + '</b> ' + h[1] + '</li>'; }).join('');
  }

  /* ---------- the day ---------- */
  function render(n) {
    current = n;
    var d = getDay(n), now = L.today();

    $('dayword').textContent = n === now ? S.today : d.weekday;
    $('datetext').textContent = longDate(d);
    $('date').value = d.iso;
    $('today').hidden = n === now;
    document.title = S.colors[d.color] + ' – ' + longDate(d) + ' | ' + S.title;

    var notes = d.notes.slice();
    d.saints.forEach(function (s) {
      if (s.status === 'optional' && s.color !== d.color) notes.push(S.ifCelebrated(S.colors[s.color], s.name));
    });
    var hero = $('hero');
    hero.setAttribute('data-color', d.color);
    hero.innerHTML =
      '<p class="pill">' + esc(d.seasonName) + '</p>' +
      '<button id="share" class="sharebtn">' + esc(S.share) + '</button>' +
      '<p class="label">' + esc(S.wear) + '</p>' +
      '<p class="wear">' + esc(S.colors[d.color]) + '</p>' +
      '<p class="tip">' + esc(S.tips[d.color]) + '</p>' +
      '<hr>' +
      '<p class="label">' + esc(S.celebration) + '</p>' +
      '<p class="celebration">' + esc(d.name) + '</p>' +
      '<p class="rank">' + esc(d.rank) + (d.obligation ? ' · ' + esc(S.obligation) : '') + '</p>' +
      notes.map(function (t) { return '<p class="note">' + esc(t) + '</p>'; }).join('');
    $('share').onclick = function () { share(d); };

    var cycle = d.proper ? S.proper
      : d.dow === 0 ? S.sundayYear + d.sundayCycle
        : S.weekdayYear + d.weekdayCycle + ' (' + S.sundayCycle + d.sundayCycle + ')';
    $('readings').innerHTML =
      '<p class="strong">' + esc(d.name) + '</p>' +
      '<p class="muted">' + esc(cycle) + '</p>' +
      citations(d) +
      '<a class="btn" href="' + d.readingsUrl + '" target="_blank" rel="noopener">' + esc(S.readOn(S.shortDate(d, S.months))) + '</a>';

    fillScripture(n);

    $('saints').innerHTML = d.saints.length
      ? '<ul class="saintlist">' + d.saints.map(function (s, i) {
        var status = s.status === 'optional' ? S.optional : s.status === 'superseded' ? S.superseded(d.name) : '';
        var inner = '<i data-color="' + s.color + '"></i><div>' +
          '<p class="strong">' + esc(s.name) + '</p>' +
          (s.title ? '<p>' + esc(s.title) + '</p>' : '') +
          '<p class="muted">' + esc(s.rank) + (status ? ' · ' + esc(status) : '') +
          (s.moved ? ' · ' + esc(S.movedFrom) : '') + '</p>' +
          (BIOS[s.key] ? '<p class="more">' + esc(S.more) + ' ›</p>' : '') + '</div>';
        return BIOS[s.key]
          ? '<li><button class="saintbtn" data-i="' + i + '">' + inner + '</button></li>'
          : '<li><div class="saintrow">' + inner + '</div></li>';
      }).join('') + '</ul>'
      : '<p class="muted">' + esc(S.noSaint) + '</p>';
    $('saints').onclick = function (e) {
      var b = e.target.closest('.saintbtn');
      if (b) openSaint(d.saints[+b.getAttribute('data-i')], d);
    };

    // week strip, Sunday to Saturday
    var start = n - d.dow, html = '';
    for (var i = 0; i < 7; i++) html += dayButton(getDay(start + i), n, true);
    $('week').innerHTML = html;

    var p = L.parts(n);
    monthAnchor = L.dn(p.y, p.m, 1);
    renderMonth();
  }

  // Reading citations, where we have them (2027). Each Mass of the day is "Label=citations|lectionary".
  function citations(d) {
    var raw = (ascThu && READINGS[d.iso + 'T']) || READINGS[d.iso];
    if (!raw) return '';
    var sets = raw.split(';;');
    return '<div class="masses">' + sets.map(function (set, i) {
      var bar = set.lastIndexOf('|'), body = set.slice(0, bar), lec = set.slice(bar + 1), label = '';
      var eq = body.indexOf('=');
      if (eq > 0) { label = body.slice(0, eq); body = body.slice(eq + 1); }
      var head = (label ? '<b>' + esc(S.massLabels[label] || label) + ':</b> ' : '') +
        esc(body.split('/').join(' · ')) +
        ' <span class="muted">(' + esc(S.lectionary) + ' ' + esc(lec) + ')</span>';
      var text = '<div class="scripture" data-cites="' + esc(body) + '"><p class="muted">' + esc(S.loadingText) + '</p></div>';
      // a day with several Masses folds them up, with the last (the Mass of the day) open
      return sets.length > 1
        ? '<details class="mass"' + (i === sets.length - 1 ? ' open' : '') + '><summary>' + head + '</summary>' + text + '</details>'
        : '<div class="mass"><p>' + head + '</p>' + text + '</div>';
    }).join('') + '</div><p class="fine">' + esc(S.citeSource) + '</p>';
  }

  // Fill in the Bible text for the citations on screen, loading each book the first time it is needed.
  function fillScripture(n) {
    Array.prototype.forEach.call(document.querySelectorAll('#readings .scripture'), function (box) {
      var list = SC.passages(box.getAttribute('data-cites'));
      var codes = list.filter(function (p) { return p.parsed; }).map(function (p) { return p.parsed.code; });
      Promise.all(codes.map(SC.load)).then(function () {
        if (current !== n || !box.isConnected) return;
        box.innerHTML = list.map(function (p) {
          var vs = p.parsed ? SC.verses(p.parsed) : [], lastCh = null;
          var body = vs.length ? '<p class="verses">' + vs.map(function (v) {
            var mark = v.ch !== lastCh ? v.ch + ':' + v.v : v.v; lastCh = v.ch;
            return '<sup>' + mark + '</sup>' + esc(v.text);
          }).join(' ') + '</p>' : '<p class="muted">' + esc(S.noText) + '</p>';
          return '<div class="passage"><h3><span>' + esc(p.parsed && p.parsed.gospel ? S.gospel : S.reading) + '</span>' + esc(p.cite) + '</h3>' +
            body + (p.parsed && p.parsed.approx && vs.length ? '<p class="fine">' + esc(S.approxNote) + '</p>' : '') + '</div>';
        }).join('');
      }, function () {
        if (box.isConnected) box.innerHTML = '<p class="muted">' + esc(S.noText) + '</p>';
      });
    });
  }

  function dayButton(w, selected, withName) {
    return '<button data-n="' + w.n + '"' + (w.n === selected ? ' aria-current="date"' : '') +
      (w.n === L.today() ? ' class="istoday"' : '') +
      ' aria-label="' + esc(w.weekday + ' ' + longDate(w) + ': ' + S.colors[w.color] + ', ' + w.name) + '">' +
      (withName ? '<span>' + S.wdShort[w.dow] + '</span>' : '') +
      '<b>' + w.day + '</b><i data-color="' + w.color + '"></i></button>';
  }

  /* ---------- month view ---------- */
  function renderMonth() {
    var p = L.parts(monthAnchor), lead = L.dow(monthAnchor);
    var next = p.m === 12 ? L.dn(p.y + 1, 1, 1) : L.dn(p.y, p.m + 1, 1);
    $('monthName').textContent = cap(S.months[p.m - 1]) + ' ' + p.y;
    $('monthSub').textContent = cap(S.months[p.m - 1]) + ' ' + p.y;
    var html = S.wdShort.map(function (w) { return '<span class="mh">' + w + '</span>'; }).join('');
    for (var i = 0; i < lead; i++) html += '<span></span>';
    for (var n = monthAnchor; n < next; n++) html += dayButton(getDay(n), current, false);
    $('month').innerHTML = html;
  }
  function shiftMonth(by) {
    var p = L.parts(monthAnchor), m = p.m + by, y = p.y;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    monthAnchor = L.dn(y, m, 1);
    renderMonth();
  }

  /* ---------- saint page ---------- */
  function openSaint(s, d) {
    var b = BIOS[s.key]; if (!b) return;
    var bio = lang === 'es' ? b[2] : b[0], patron = lang === 'es' ? b[3] : b[1];
    $('saintBody').innerHTML =
      '<p class="label">' + esc(S.shortDate(d, S.months)) + ' · ' + esc(s.rank) + '</p>' +
      '<h2 class="dlgname"><i data-color="' + s.color + '"></i> ' + esc(s.name) + '</h2>' +
      (s.title ? '<p class="muted">' + esc(s.title) + '</p>' : '') +
      '<p class="bio">' + esc(bio) + '</p>' +
      (patron ? '<p class="patron"><b>' + esc(S.patron) + ':</b> ' + esc(patron) + '</p>' : '');
    var dlg = $('saintDialog');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $('saintClose').onclick = function () { $('saintDialog').close(); };
  $('saintDialog').onclick = function (e) { if (e.target === this) this.close(); }; // click on the backdrop

  /* ---------- share ---------- */
  var toastTimer;
  function toast(text) {
    var t = $('toast'); t.textContent = text; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }
  function share(d) {
    var url = location.origin + location.pathname + '#' + d.iso;
    var text = S.shareText(S.colors[d.color], d.name, longDate(d));
    if (navigator.share) {
      navigator.share({ title: S.title, text: text, url: url }).catch(function () { /* cancelled */ });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text + ' ' + url).then(function () { toast(S.copied); }, function () { legacyCopy(text + ' ' + url); });
    } else {
      legacyCopy(text + ' ' + url);
    }
  }
  // Older browsers, and pages where the clipboard permission is refused.
  function legacyCopy(str) {
    var ta = document.createElement('textarea'), ok = false;
    ta.value = str; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    toast(ok ? S.copied : str);
  }

  /* ---------- navigation ---------- */
  function go(n) {
    if (n === current) return;
    var hash = n === L.today() ? '' : '#' + L.iso(n);
    history.replaceState(null, '', location.pathname + location.search + hash);
    render(n);
  }
  function fromHash() { return L.fromIso(location.hash.slice(1)) || L.today(); }
  function pick(e) {
    var b = e.target.closest('button[data-n]');
    if (b) go(+b.getAttribute('data-n'));
  }
  function setLang(v) { lang = I18N[v] ? v : 'en'; save('lc.lang', lang); renderStatic(); render(current); }

  $('prev').onclick = function () { go(current - 1); };
  $('next').onclick = function () { go(current + 1); };
  $('today').onclick = function () { go(L.today()); };
  $('date').onchange = function () { var n = L.fromIso(this.value); if (n !== null) go(n); };
  $('week').onclick = pick;
  $('month').onclick = pick;
  $('prevMonth').onclick = function () { shiftMonth(-1); };
  $('nextMonth').onclick = function () { shiftMonth(1); };
  $('langBtn').onclick = function () { setLang(lang === 'en' ? 'es' : 'en'); };
  $('langSel').onchange = function () { setLang(this.value); };
  $('ascSel').onchange = function () { ascThu = this.value === 'thu'; save('lc.asc', this.value); render(current); };
  window.addEventListener('hashchange', function () { render(fromHash()); });
  document.addEventListener('keydown', function (e) {
    if (/INPUT|SELECT/.test(e.target.tagName) || $('saintDialog').open) return;
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });

  renderStatic();
  render(fromHash());

  // Offline support. Only on http(s); opening index.html straight from disk still works without it.
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* offline support is optional */ });
    // once the page is settled, ask the worker to save the Bible books for offline reading
    navigator.serviceWorker.ready.then(function (reg) {
      setTimeout(function () { if (reg.active) reg.active.postMessage({ type: 'precache', files: SC.allFiles() }); }, 4000);
    }).catch(function () { /* optional */ });
  }
})();
