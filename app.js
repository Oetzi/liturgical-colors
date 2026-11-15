(function () {
  'use strict';
  var L = window.LitCal;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var WEAR = { green: 'Green', white: 'White or Gold', red: 'Red', violet: 'Violet (Purple)', rose: 'Rose', black: 'Black' };
  var $ = function (id) { return document.getElementById(id); };
  var current;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function longDate(d) { return MONTHS[d.month - 1] + ' ' + d.day + ', ' + d.year; }

  function render(n) {
    current = n;
    var d = L.getDay(n), now = L.today();

    $('dayword').textContent = n === now ? 'Today' : d.weekday;
    $('datetext').textContent = longDate(d);
    $('date').value = d.iso;
    $('today').hidden = n === now;
    document.title = WEAR[d.color] + ' – ' + longDate(d) + ' | Liturgical Colors';

    // hero card
    var optional = d.saints.filter(function (s) { return s.status === 'optional'; });
    var notes = d.notes.slice();
    optional.forEach(function (s) {
      if (s.color !== d.color) notes.push(WEAR[s.color] + ' if the priest celebrates ' + s.name + '.');
    });
    var hero = $('hero');
    hero.setAttribute('data-color', d.color);
    hero.innerHTML =
      '<p class="pill">' + esc(d.seasonName) + '</p>' +
      '<p class="label">Wear</p>' +
      '<p class="wear">' + esc(WEAR[d.color]) + '</p>' +
      '<hr>' +
      '<p class="label">Celebration</p>' +
      '<p class="celebration">' + esc(d.name) + '</p>' +
      '<p class="rank">' + esc(d.rank) + (d.obligation ? ' · Holy day of obligation' : '') + '</p>' +
      notes.map(function (t) { return '<p class="note">' + esc(t) + '</p>'; }).join('');

    // readings
    var cycle = d.dow === 0
      ? 'Sunday readings: Year ' + d.sundayCycle
      : 'Weekday readings: Year ' + d.weekdayCycle + ' (Sunday cycle: Year ' + d.sundayCycle + ')';
    $('readings').innerHTML =
      '<p class="strong">' + esc(d.name) + '</p>' +
      '<p class="muted">' + esc(cycle) + '</p>' +
      '<a class="btn" href="' + d.readingsUrl + '" target="_blank" rel="noopener">Read the readings for ' +
      esc(MONTHS[d.month - 1] + ' ' + d.day) + ' on USCCB &rarr;</a>';

    // saints
    var STATUS = {
      celebrated: '',
      optional: 'May be celebrated today',
      superseded: 'Not celebrated this year – ' + esc(d.name) + ' takes precedence'
    };
    $('saints').innerHTML = d.saints.length
      ? '<ul class="saintlist">' + d.saints.map(function (s) {
        return '<li><i data-color="' + s.color + '"></i><div>' +
          '<p class="strong">' + esc(s.name) + '</p>' +
          (s.title ? '<p>' + esc(s.title) + '</p>' : '') +
          '<p class="muted">' + esc(s.rank) + (STATUS[s.status] ? ' · ' + STATUS[s.status] : '') +
          (s.moved ? ' · moved from its usual date' : '') + '</p></div></li>';
      }).join('') + '</ul>'
      : '<p class="muted">No saint is assigned to this date on the general calendar.</p>';

    // week strip, Sunday to Saturday
    var start = n - d.dow, html = '';
    for (var i = 0; i < 7; i++) {
      var w = L.getDay(start + i);
      html += '<button data-n="' + w.n + '"' + (w.n === n ? ' aria-current="date"' : '') +
        ' aria-label="' + esc(w.weekday + ' ' + longDate(w) + ': ' + WEAR[w.color] + ', ' + w.name) + '">' +
        '<span>' + SHORT[i] + '</span><b>' + w.day + '</b><i data-color="' + w.color + '"></i></button>';
    }
    $('week').innerHTML = html;
  }

  function go(n) {
    if (n === current) return;
    var hash = n === L.today() ? '' : '#' + L.iso(n);
    history.replaceState(null, '', location.pathname + location.search + hash);
    render(n);
  }
  function fromHash() { return L.fromIso(location.hash.slice(1)) || L.today(); }

  $('prev').onclick = function () { go(current - 1); };
  $('next').onclick = function () { go(current + 1); };
  $('today').onclick = function () { go(L.today()); };
  $('date').onchange = function () { var n = L.fromIso(this.value); if (n !== null) go(n); };
  $('week').onclick = function (e) {
    var b = e.target.closest('button');
    if (b) go(+b.getAttribute('data-n'));
  };
  window.addEventListener('hashchange', function () { render(fromHash()); });
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });

  render(fromHash());
})();
