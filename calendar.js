/*
 * LitCal - Roman Catholic liturgical calendar (Ordinary Form, dioceses of the United States).
 * Pure date maths, no network. Days are handled as whole "day numbers" (days since 1970-01-01, UTC)
 * so that time zones and daylight saving can never shift a date.
 */
(function (root) {
  'use strict';

  var DAY = 86400000;
  var WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function dn(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / DAY); }
  function parts(n) {
    var t = new Date(n * DAY);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
  }
  function dow(n) { return (((n + 4) % 7) + 7) % 7; } // 1970-01-01 was a Thursday
  function pad(v) { return (v < 10 ? '0' : '') + v; }
  function iso(n) { var p = parts(n); return p.y + '-' + pad(p.m) + '-' + pad(p.d); }
  function fromIso(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var n = dn(+m[1], +m[2], +m[3]);
    return iso(n) === s ? n : null;
  }
  function ord(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /* ---------- anchors ---------- */

  // Easter Sunday, Gregorian calendar (Meeus/Jones/Butcher algorithm).
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return dn(y, month, day);
  }
  // First Sunday of Advent: the fourth Sunday before Christmas Day.
  function advent1(y) {
    var x = dn(y, 12, 25);
    return x - (dow(x) || 7) - 21;
  }
  // Epiphany in the US: the Sunday between January 2 and 8.
  function epiphany(y) {
    var j = dn(y, 1, 2);
    return j + ((7 - dow(j)) % 7);
  }
  // Baptism of the Lord: Sunday after Epiphany, or the Monday after when Epiphany is Jan 7 or 8.
  function baptism(y) {
    var e = epiphany(y);
    return parts(e).d >= 7 ? e + 1 : e + 7;
  }
  // Holy Family: Sunday within the octave of Christmas, or Dec 30 when Christmas is a Sunday.
  function holyFamily(y) {
    var x = dn(y, 12, 25);
    return dow(x) === 0 ? dn(y, 12, 30) : x + (7 - dow(x));
  }

  /* ---------- the season ("temporal") celebration of a day ---------- */

  // prec = order of precedence, lower wins (Table of Liturgical Days, simplified).
  //  1 Triduum / Easter   2 great solemnities of the Lord, Sundays of Advent-Lent-Easter, Ash Wed, Holy Week, Easter octave
  //  3 solemnities, All Souls   5 feasts of the Lord   6 Sundays of Christmas and Ordinary Time   7 feasts
  //  9 Advent weekdays Dec 17-24, Christmas octave, Lent weekdays   10 memorials   11 other weekdays   12 optional memorials (never displace the weekday)
  function T(name, season, color, prec, rank, note) {
    return { name: name, season: season, color: color, prec: prec, rank: rank, note: note || '', temporal: true };
  }

  function temporal(n) {
    var p = parts(n), y = p.y, w = dow(n), E = easter(y), ash = E - 46, A1 = advent1(y), X = dn(y, 12, 25);
    var wk, k;

    // Christmas Time, end of the civil year
    if (n >= X) {
      if (n === X) return T('The Nativity of the Lord (Christmas)', 'christmas', 'white', 2, 'Solemnity');
      if (n === holyFamily(y)) return T('The Holy Family of Jesus, Mary and Joseph', 'christmas', 'white', 5, 'Feast');
      return T(ord(n - X + 1) + ' Day within the Octave of Christmas', 'christmas', 'white', 9, 'Weekday');
    }
    // Christmas Time, start of the civil year
    var ep = epiphany(y), bap = baptism(y);
    if (n <= bap) {
      if (n === ep) return T('The Epiphany of the Lord', 'christmas', 'white', 2, 'Solemnity');
      if (n === bap) return T('The Baptism of the Lord', 'christmas', 'white', 5, 'Feast');
      if (p.d === 1) return T('Octave Day of Christmas', 'christmas', 'white', 9, 'Weekday');
      return T(n < ep ? 'Christmas Weekday' : WD[w] + ' after Epiphany', 'christmas', 'white', 11, 'Weekday');
    }
    // Lent, Holy Week and the Triduum
    if (n >= ash && n < E) {
      k = E - n;
      if (n === ash) return T('Ash Wednesday', 'lent', 'violet', 2, 'Weekday', 'A day of fasting and abstinence.');
      if (k === 7) return T('Palm Sunday of the Passion of the Lord', 'holyweek', 'red', 2, 'Sunday');
      if (k === 3) return T('Holy Thursday', 'triduum', 'white', 1, 'Paschal Triduum', 'White is for the evening Mass of the Lord’s Supper.');
      if (k === 2) return T('Good Friday of the Passion of the Lord', 'triduum', 'red', 1, 'Paschal Triduum', 'There is no Mass today; red is worn at the Celebration of the Lord’s Passion. A day of fasting and abstinence.');
      if (k === 1) return T('Holy Saturday', 'triduum', 'white', 1, 'Paschal Triduum', 'There is no Mass during the day; white is for the Easter Vigil tonight.');
      if (k < 7) return T(WD[w] + ' of Holy Week', 'holyweek', 'violet', 2, 'Weekday');
      wk = Math.floor((n - (E - 42)) / 7) + 1;
      if (w === 0) {
        return wk === 4
          ? T('4th Sunday of Lent (Laetare Sunday)', 'lent', 'rose', 2, 'Sunday', 'Rose may be worn today; violet is also allowed.')
          : T(ord(wk) + ' Sunday of Lent', 'lent', 'violet', 2, 'Sunday');
      }
      if (wk < 1) return T(WD[w] + ' after Ash Wednesday', 'lent', 'violet', 9, 'Weekday');
      return T(WD[w] + ' of the ' + ord(wk) + ' Week of Lent', 'lent', 'violet', 9, 'Weekday');
    }
    // Easter Time
    if (n >= E && n <= E + 49) {
      k = n - E; wk = Math.floor(k / 7) + 1;
      if (k === 0) return T('Easter Sunday of the Resurrection of the Lord', 'easter', 'white', 1, 'Solemnity');
      if (k < 7) return T(WD[w] + ' within the Octave of Easter', 'easter', 'white', 2, 'Solemnity');
      if (k === 7) return T('2nd Sunday of Easter (Divine Mercy Sunday)', 'easter', 'white', 2, 'Sunday');
      if (k === 42) return T('The Ascension of the Lord', 'easter', 'white', 2, 'Solemnity', 'Dioceses that keep the Ascension on Thursday celebrate the 7th Sunday of Easter today.');
      if (k === 49) return T('Pentecost Sunday', 'easter', 'red', 2, 'Solemnity');
      if (w === 0) return T(ord(wk) + ' Sunday of Easter', 'easter', 'white', 2, 'Sunday');
      return T(WD[w] + ' of the ' + ord(wk) + ' Week of Easter', 'easter', 'white', 11, 'Weekday',
        k === 39 ? 'Some dioceses celebrate the Ascension of the Lord today.' : '');
    }
    // Advent
    if (n >= A1) {
      wk = Math.floor((n - A1) / 7) + 1;
      if (w === 0) {
        return wk === 3
          ? T('3rd Sunday of Advent (Gaudete Sunday)', 'advent', 'rose', 2, 'Sunday', 'Rose may be worn today; violet is also allowed.')
          : T(ord(wk) + ' Sunday of Advent', 'advent', 'violet', 2, 'Sunday');
      }
      return T(WD[w] + ' of the ' + ord(wk) + ' Week of Advent', 'advent', 'violet', p.d >= 17 ? 9 : 11, 'Weekday');
    }
    // Ordinary Time: counted up from the Baptism of the Lord, and back from Advent after Pentecost.
    if (n < ash) wk = Math.floor((n - (bap - dow(bap))) / 7) + 1;
    else wk = 35 - (A1 - (n - w)) / 7;
    if (n === E + 56) return T('The Most Holy Trinity', 'ordinary', 'white', 3, 'Solemnity');
    if (n === E + 63) return T('The Most Holy Body and Blood of Christ (Corpus Christi)', 'ordinary', 'white', 3, 'Solemnity');
    if (w === 0) {
      return wk === 34
        ? T('Our Lord Jesus Christ, King of the Universe', 'ordinary', 'white', 3, 'Solemnity')
        : T(ord(wk) + ' Sunday in Ordinary Time', 'ordinary', 'green', 6, 'Sunday');
    }
    return T(WD[w] + ' of the ' + ord(wk) + ' Week in Ordinary Time', 'ordinary', 'green', 11, 'Weekday');
  }

  /* ---------- saints and fixed feasts ("sanctoral") ---------- */

  var RANK = {
    S: { prec: 3, label: 'Solemnity' },
    D: { prec: 3, label: 'Commemoration' },
    L: { prec: 5, label: 'Feast of the Lord' },
    F: { prec: 7, label: 'Feast' },
    M: { prec: 10, label: 'Memorial' },
    O: { prec: 12, label: 'Optional Memorial' }
  };
  var COLOR = { w: 'white', r: 'red', v: 'violet' };
  var byDate = {}, special = [];

  function entry(rank, color, name, title, id) {
    return { name: name, title: title || '', color: COLOR[color], prec: RANK[rank].prec, rank: RANK[rank].label, id: id || '' };
  }
  (root.LITCAL_SAINTS || '').split('\n').forEach(function (line) {
    var f = line.trim().split('|');
    if (f.length < 4) return;
    var md = f[0].split('/'), e = entry(f[1], f[2], f[3], f[4], f[5]);
    e.m = +md[0]; e.d = +md[1];
    if (e.id) special.push(e);
    else (byDate[f[0]] = byDate[f[0]] || []).push(e);
  });

  // Solemnities that move when they collide with a higher day.
  function effectiveDate(e, y) {
    var base = dn(y, e.m, e.d), E = easter(y);
    if (e.id === 'joseph') return base >= E - 7 ? E - 8 : (dow(base) === 0 ? base + 1 : base);
    if (e.id === 'annunciation') return (base >= E - 7 && base <= E + 7) ? E + 8 : (dow(base) === 0 ? base + 1 : base);
    if (e.id === 'immaculate') return dow(base) === 0 ? base + 1 : base;
    if (e.id === 'baptist') return base === E + 68 ? base - 1 : base;
    return base;
  }

  function sanctoral(n) {
    var p = parts(n), E = easter(p.y), out = (byDate[p.m + '/' + p.d] || []).slice();
    special.forEach(function (e) {
      if (effectiveDate(e, p.y) === n) {
        var c = Object.assign({}, e);
        if (dn(p.y, e.m, e.d) !== n) c.moved = true;
        out.push(c);
      }
    });
    if (n === E + 68) out.push(entry('S', 'w', 'The Most Sacred Heart of Jesus', 'Friday after the second Sunday after Pentecost'));
    if (n === E + 69) out.push(entry('M', 'w', 'The Immaculate Heart of the Blessed Virgin Mary', 'Saturday after the Sacred Heart'));
    if (n === E + 50) out.push(entry('M', 'w', 'The Blessed Virgin Mary, Mother of the Church', 'Monday after Pentecost'));
    return out;
  }

  /* ---------- putting a day together ---------- */

  var SEASON = {
    advent: 'Advent', christmas: 'Christmas Time', ordinary: 'Ordinary Time',
    lent: 'Lent', holyweek: 'Holy Week', triduum: 'Paschal Triduum', easter: 'Easter Time'
  };

  function getDay(n) {
    var p = parts(n), w = dow(n), t = temporal(n), s = sanctoral(n);
    var all = [t].concat(s).sort(function (a, b) { return a.prec - b.prec; }); // stable: the season wins ties
    var win = all[0];
    var weekday = win.temporal && win.prec >= 9; // an ordinary or privileged weekday
    var saints = s.map(function (e) {
      var status;
      if (e === win) status = 'celebrated';
      else if (weekday && e.prec >= 10) status = 'optional';
      else status = 'superseded';
      return { name: e.name, title: e.title, rank: e.rank, color: e.color, status: status, moved: !!e.moved };
    });

    var notes = [];
    if (win.note) notes.push(win.note);
    if (win.id === 'souls') notes.push('Black or white may also be used.');
    if (win.moved) notes.push('Moved from its usual date this year.');

    var obligation = false;
    if (w !== 0) {
      if (p.m === 12 && p.d === 25) obligation = true;
      else if (win.id === 'immaculate' && p.d === 8) obligation = true;
      else if (win.id === 'obl' && w !== 1 && w !== 6) obligation = true;
    }

    var litYear = n >= advent1(p.y) ? p.y + 1 : p.y;
    return {
      n: n, iso: iso(n), year: p.y, month: p.m, day: p.d, dow: w, weekday: WD[w],
      season: t.season, seasonName: SEASON[t.season],
      name: win.name, rank: win.rank, color: win.color, title: win.title || '',
      notes: notes, saints: saints, obligation: obligation,
      sundayCycle: ['C', 'A', 'B'][litYear % 3], weekdayCycle: litYear % 2 ? 'I' : 'II',
      readingsUrl: 'https://bible.usccb.org/bible/readings/' + pad(p.m) + pad(p.d) + pad(p.y % 100) + '.cfm'
    };
  }

  function today() {
    var t = new Date();
    return dn(t.getFullYear(), t.getMonth() + 1, t.getDate());
  }

  root.LitCal = {
    getDay: getDay, today: today, dn: dn, iso: iso, fromIso: fromIso, dow: dow, parts: parts,
    easter: easter, advent1: advent1
  };
})(typeof window !== 'undefined' ? window : globalThis);
