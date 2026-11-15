/*
 * LitCal - Roman Catholic liturgical calendar (Ordinary Form, dioceses of the United States).
 * Pure date maths, no network. Days are handled as whole "day numbers" (days since 1970-01-01, UTC)
 * so that time zones and daylight saving can never shift a date.
 *
 * LitCal.getDay(n, { lang: 'en' | 'es', ascThu: true | false })
 *   ascThu: the Ascension is kept on Thursday (provinces of Boston, Hartford, New York, Omaha, Philadelphia)
 */
(function (root) {
  'use strict';

  var DAY = 86400000;

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
  function roman(n) {
    var r = '', map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    map.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } });
    return r;
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

  /* ---------- wording, English and Spanish ---------- */

  var EN_WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ES_WD = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var ES_ORD = ['', 'Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto', 'Séptimo'];

  var LOC = {
    en: {
      wd: EN_WD,
      season: { advent: 'Advent', christmas: 'Christmas Time', ordinary: 'Ordinary Time', lent: 'Lent', holyweek: 'Holy Week', triduum: 'Paschal Triduum', easter: 'Easter Time' },
      rank: { sol: 'Solemnity', comm: 'Commemoration', lordFeast: 'Feast of the Lord', feast: 'Feast', mem: 'Memorial', opt: 'Optional Memorial', prayer: 'Day of Prayer', sun: 'Sunday', wd: 'Weekday', trid: 'Paschal Triduum', oct: 'Octave of Easter' },
      note: {
        fast: 'A day of fasting and abstinence from meat.',
        holyThu: 'White is for the evening Mass of the Lord’s Supper.',
        goodFri: 'There is no Mass today; red is worn at the Celebration of the Lord’s Passion. A day of fasting and abstinence from meat.',
        holySat: 'There is no Mass during the day; white is for the Easter Vigil tonight.',
        rose: 'Rose may be worn today; violet is also allowed.',
        abstain: 'Friday of Lent: a day of abstinence from meat.',
        souls: 'Black or white may also be used.',
        violetToo: 'Violet may also be used.',
        moved: 'Moved from its usual date this year.'
      },
      n: {
        xmas: function () { return 'The Nativity of the Lord (Christmas)'; },
        holyFamily: function () { return 'The Holy Family of Jesus, Mary and Joseph'; },
        xmasOct: function (k) { return ord(k) + ' Day within the Octave of Christmas'; },
        epiph: function () { return 'The Epiphany of the Lord'; },
        bap: function () { return 'The Baptism of the Lord'; },
        octDay: function () { return 'Octave Day of Christmas'; },
        xmasWd: function () { return 'Christmas Weekday'; },
        afterEp: function (w) { return EN_WD[w] + ' after Epiphany'; },
        ash: function () { return 'Ash Wednesday'; },
        palm: function () { return 'Palm Sunday of the Passion of the Lord'; },
        holyThu: function () { return 'Holy Thursday'; },
        goodFri: function () { return 'Good Friday of the Passion of the Lord'; },
        holySat: function () { return 'Holy Saturday'; },
        holyWd: function (w) { return EN_WD[w] + ' of Holy Week'; },
        laetare: function () { return '4th Sunday of Lent (Laetare Sunday)'; },
        lentSun: function (k) { return ord(k) + ' Sunday of Lent'; },
        afterAsh: function (w) { return EN_WD[w] + ' after Ash Wednesday'; },
        lentWd: function (w, k) { return EN_WD[w] + ' of the ' + ord(k) + ' Week of Lent'; },
        easter: function () { return 'Easter Sunday of the Resurrection of the Lord'; },
        eastOct: function (w) { return EN_WD[w] + ' within the Octave of Easter'; },
        mercy: function () { return '2nd Sunday of Easter (Divine Mercy Sunday)'; },
        asc: function () { return 'The Ascension of the Lord'; },
        pent: function () { return 'Pentecost Sunday'; },
        eastSun: function (k) { return ord(k) + ' Sunday of Easter'; },
        eastWd: function (w, k) { return EN_WD[w] + ' of the ' + ord(k) + ' Week of Easter'; },
        gaudete: function () { return '3rd Sunday of Advent (Gaudete Sunday)'; },
        advSun: function (k) { return ord(k) + ' Sunday of Advent'; },
        advWd: function (w, k) { return EN_WD[w] + ' of the ' + ord(k) + ' Week of Advent'; },
        trinity: function () { return 'The Most Holy Trinity'; },
        corpus: function () { return 'The Most Holy Body and Blood of Christ (Corpus Christi)'; },
        king: function () { return 'Our Lord Jesus Christ, King of the Universe'; },
        otSun: function (k) { return ord(k) + ' Sunday in Ordinary Time'; },
        otWd: function (w, k) { return EN_WD[w] + ' of the ' + ord(k) + ' Week in Ordinary Time'; }
      }
    },
    es: {
      wd: ES_WD,
      season: { advent: 'Adviento', christmas: 'Tiempo de Navidad', ordinary: 'Tiempo Ordinario', lent: 'Cuaresma', holyweek: 'Semana Santa', triduum: 'Triduo Pascual', easter: 'Tiempo Pascual' },
      rank: { sol: 'Solemnidad', comm: 'Conmemoración', lordFeast: 'Fiesta del Señor', feast: 'Fiesta', mem: 'Memoria', opt: 'Memoria libre', prayer: 'Día de oración', sun: 'Domingo', wd: 'Feria', trid: 'Triduo Pascual', oct: 'Octava de Pascua' },
      note: {
        fast: 'Día de ayuno y abstinencia de carne.',
        holyThu: 'El blanco es para la Misa vespertina de la Cena del Señor.',
        goodFri: 'Hoy no hay Misa; el rojo se usa en la Celebración de la Pasión del Señor. Día de ayuno y abstinencia de carne.',
        holySat: 'No hay Misa durante el día; el blanco es para la Vigilia Pascual de esta noche.',
        rose: 'Hoy se puede usar el rosa; también se permite el morado.',
        abstain: 'Viernes de Cuaresma: día de abstinencia de carne.',
        souls: 'También se puede usar el negro o el blanco.',
        violetToo: 'También se puede usar el morado.',
        moved: 'Trasladada de su fecha habitual este año.'
      },
      n: {
        xmas: function () { return 'Natividad del Señor (Navidad)'; },
        holyFamily: function () { return 'Sagrada Familia de Jesús, María y José'; },
        xmasOct: function (k) { return ES_ORD[k] + ' día de la Octava de Navidad'; },
        epiph: function () { return 'Epifanía del Señor'; },
        bap: function () { return 'Bautismo del Señor'; },
        octDay: function () { return 'Octava de Navidad'; },
        xmasWd: function () { return 'Feria del Tiempo de Navidad'; },
        afterEp: function (w) { return ES_WD[w] + ' después de Epifanía'; },
        ash: function () { return 'Miércoles de Ceniza'; },
        palm: function () { return 'Domingo de Ramos de la Pasión del Señor'; },
        holyThu: function () { return 'Jueves Santo'; },
        goodFri: function () { return 'Viernes Santo de la Pasión del Señor'; },
        holySat: function () { return 'Sábado Santo'; },
        holyWd: function (w) { return ES_WD[w] + ' Santo'; },
        laetare: function () { return 'IV Domingo de Cuaresma (Domingo Laetare)'; },
        lentSun: function (k) { return roman(k) + ' Domingo de Cuaresma'; },
        afterAsh: function (w) { return ES_WD[w] + ' después de Ceniza'; },
        lentWd: function (w, k) { return ES_WD[w] + ' de la ' + roman(k) + ' semana de Cuaresma'; },
        easter: function () { return 'Domingo de Pascua de la Resurrección del Señor'; },
        eastOct: function (w) { return ES_WD[w] + ' de la Octava de Pascua'; },
        mercy: function () { return 'II Domingo de Pascua (Domingo de la Divina Misericordia)'; },
        asc: function () { return 'Ascensión del Señor'; },
        pent: function () { return 'Domingo de Pentecostés'; },
        eastSun: function (k) { return roman(k) + ' Domingo de Pascua'; },
        eastWd: function (w, k) { return ES_WD[w] + ' de la ' + roman(k) + ' semana de Pascua'; },
        gaudete: function () { return 'III Domingo de Adviento (Domingo Gaudete)'; },
        advSun: function (k) { return roman(k) + ' Domingo de Adviento'; },
        advWd: function (w, k) { return ES_WD[w] + ' de la ' + roman(k) + ' semana de Adviento'; },
        trinity: function () { return 'Santísima Trinidad'; },
        corpus: function () { return 'Santísimo Cuerpo y Sangre de Cristo (Corpus Christi)'; },
        king: function () { return 'Nuestro Señor Jesucristo, Rey del Universo'; },
        otSun: function (k) { return roman(k) + ' Domingo del Tiempo Ordinario'; },
        otWd: function (w, k) { return ES_WD[w] + ' de la ' + roman(k) + ' semana del Tiempo Ordinario'; }
      }
    }
  };

  /* ---------- the season ("temporal") celebration of a day ---------- */

  // prec = order of precedence, lower wins (Table of Liturgical Days, simplified).
  //  1 Triduum / Easter   2 great solemnities of the Lord, Sundays of Advent-Lent-Easter, Ash Wed, Holy Week, Easter octave
  //  3 solemnities, All Souls   5 feasts of the Lord   6 Sundays of Christmas and Ordinary Time   7 feasts
  //  9 Advent weekdays Dec 17-24, Christmas octave, Lent weekdays   10 memorials   11 other weekdays
  //  12 optional memorials (never displace the weekday)
  function T(key, a, b, season, color, prec, rankKey, noteKey) {
    return { key: key, a: a, b: b, season: season, color: color, prec: prec, rankKey: rankKey, noteKey: noteKey || '', temporal: true };
  }

  function temporal(n, ascThu) {
    var p = parts(n), y = p.y, w = dow(n), E = easter(y), ash = E - 46, A1 = advent1(y), X = dn(y, 12, 25);
    var wk, k;

    // Christmas Time, end of the civil year
    if (n >= X) {
      if (n === X) return T('xmas', 0, 0, 'christmas', 'white', 2, 'sol');
      if (n === holyFamily(y)) return T('holyFamily', 0, 0, 'christmas', 'white', 5, 'feast');
      return T('xmasOct', n - X + 1, 0, 'christmas', 'white', 9, 'wd');
    }
    // Christmas Time, start of the civil year
    var ep = epiphany(y), bap = baptism(y);
    if (n <= bap) {
      if (n === ep) return T('epiph', 0, 0, 'christmas', 'white', 2, 'sol');
      if (n === bap) return T('bap', 0, 0, 'christmas', 'white', 5, 'feast');
      if (p.d === 1) return T('octDay', 0, 0, 'christmas', 'white', 9, 'wd');
      return n < ep ? T('xmasWd', 0, 0, 'christmas', 'white', 11, 'wd') : T('afterEp', w, 0, 'christmas', 'white', 11, 'wd');
    }
    // Lent, Holy Week and the Triduum
    if (n >= ash && n < E) {
      k = E - n;
      if (n === ash) return T('ash', 0, 0, 'lent', 'violet', 2, 'wd', 'fast');
      if (k === 7) return T('palm', 0, 0, 'holyweek', 'red', 2, 'sun');
      if (k === 3) return T('holyThu', 0, 0, 'triduum', 'white', 1, 'trid', 'holyThu');
      if (k === 2) return T('goodFri', 0, 0, 'triduum', 'red', 1, 'trid', 'goodFri');
      if (k === 1) return T('holySat', 0, 0, 'triduum', 'white', 1, 'trid', 'holySat');
      if (k < 7) return T('holyWd', w, 0, 'holyweek', 'violet', 2, 'wd');
      wk = Math.floor((n - (E - 42)) / 7) + 1;
      if (w === 0) {
        return wk === 4 ? T('laetare', 0, 0, 'lent', 'rose', 2, 'sun', 'rose') : T('lentSun', wk, 0, 'lent', 'violet', 2, 'sun');
      }
      if (wk < 1) return T('afterAsh', w, 0, 'lent', 'violet', 9, 'wd', w === 5 ? 'abstain' : '');
      return T('lentWd', w, wk, 'lent', 'violet', 9, 'wd', w === 5 ? 'abstain' : '');
    }
    // Easter Time
    if (n >= E && n <= E + 49) {
      k = n - E; wk = Math.floor(k / 7) + 1;
      if (k === 0) return T('easter', 0, 0, 'easter', 'white', 1, 'sol');
      if (k < 7) return T('eastOct', w, 0, 'easter', 'white', 2, 'oct');
      if (k === 7) return T('mercy', 0, 0, 'easter', 'white', 2, 'sun');
      if (k === (ascThu ? 39 : 42)) return T('asc', 0, 0, 'easter', 'white', 2, 'sol');
      if (k === 49) return T('pent', 0, 0, 'easter', 'red', 2, 'sol');
      if (w === 0) return T('eastSun', wk, 0, 'easter', 'white', 2, 'sun');
      return T('eastWd', w, wk, 'easter', 'white', 11, 'wd');
    }
    // Advent
    if (n >= A1) {
      wk = Math.floor((n - A1) / 7) + 1;
      if (w === 0) {
        return wk === 3 ? T('gaudete', 0, 0, 'advent', 'rose', 2, 'sun', 'rose') : T('advSun', wk, 0, 'advent', 'violet', 2, 'sun');
      }
      return T('advWd', w, wk, 'advent', 'violet', p.d >= 17 ? 9 : 11, 'wd');
    }
    // Ordinary Time: counted up from the Baptism of the Lord, and back from Advent after Pentecost.
    if (n < ash) wk = Math.floor((n - (bap - dow(bap))) / 7) + 1;
    else wk = 35 - (A1 - (n - w)) / 7;
    if (n === E + 56) return T('trinity', 0, 0, 'ordinary', 'white', 3, 'sol');
    if (n === E + 63) return T('corpus', 0, 0, 'ordinary', 'white', 3, 'sol');
    if (w === 0) {
      return wk === 34 ? T('king', 0, 0, 'ordinary', 'white', 3, 'sol') : T('otSun', wk, 0, 'ordinary', 'green', 6, 'sun');
    }
    return T('otWd', w, wk, 'ordinary', 'green', 11, 'wd');
  }

  /* ---------- saints and fixed feasts ("sanctoral") ---------- */

  var RANK = {
    S: { prec: 3, key: 'sol' }, D: { prec: 3, key: 'comm' }, L: { prec: 5, key: 'lordFeast' },
    F: { prec: 7, key: 'feast' }, M: { prec: 10, key: 'mem' }, P: { prec: 10, key: 'prayer' }, O: { prec: 12, key: 'opt' }
  };
  var COLOR = { w: 'white', r: 'red', v: 'violet' };
  var byDate = {}, special = [];

  function entry(rank, color, en, enTitle, es, esTitle, id) {
    return {
      names: { en: en, es: es || en }, titles: { en: enTitle || '', es: esTitle || '' },
      color: COLOR[color], prec: RANK[rank].prec, rankKey: RANK[rank].key, id: id || ''
    };
  }
  (root.LITCAL_SAINTS || '').split('\n').forEach(function (line) {
    var f = line.trim().split('|');
    if (f.length < 4) return;
    var md = f[0].split('/'), e = entry(f[1], f[2], f[3], f[4], f[6], f[7], f[5]);
    e.m = +md[0]; e.d = +md[1];
    if (e.id) special.push(e);
    else (byDate[f[0]] = byDate[f[0]] || []).push(e);
  });

  var MOVABLE = {
    sacredHeart: entry('S', 'w', 'The Most Sacred Heart of Jesus', 'Friday after the second Sunday after Pentecost', 'Sagrado Corazón de Jesús', 'Viernes posterior al segundo domingo después de Pentecostés'),
    immHeart: entry('M', 'w', 'The Immaculate Heart of the Blessed Virgin Mary', 'Saturday after the Sacred Heart', 'Corazón Inmaculado de la Bienaventurada Virgen María', 'Sábado posterior al Sagrado Corazón', 'immheart'),
    motherChurch: entry('M', 'w', 'The Blessed Virgin Mary, Mother of the Church', 'Monday after Pentecost', 'Bienaventurada Virgen María, Madre de la Iglesia', 'Lunes después de Pentecostés'),
    bvmSat: entry('O', 'w', 'The Blessed Virgin Mary on Saturday', '', 'Bienaventurada Virgen María en sábado', ''),
    thanks: entry('O', 'w', 'Thanksgiving Day', 'United States', 'Día de Acción de Gracias', 'Estados Unidos')
  };

  // Days that move when they collide with a higher day.
  function effectiveDate(e, y) {
    var base = dn(y, e.m, e.d), E = easter(y);
    if (e.id === 'joseph') return base >= E - 7 ? E - 8 : (dow(base) === 0 ? base + 1 : base);
    if (e.id === 'annunciation') return (base >= E - 7 && base <= E + 7) ? E + 8 : (dow(base) === 0 ? base + 1 : base);
    if (e.id === 'immaculate' || e.id === 'unborn') return dow(base) === 0 ? base + 1 : base;
    if (e.id === 'baptist') return base === E + 68 ? base - 1 : base;
    return base;
  }

  function sanctoral(n) {
    var p = parts(n), E = easter(p.y);
    var out = (byDate[p.m + '/' + p.d] || []).map(function (e) { return Object.assign({}, e); });
    special.forEach(function (e) {
      if (effectiveDate(e, p.y) === n) {
        var c = Object.assign({}, e);
        if (dn(p.y, e.m, e.d) !== n) c.moved = true;
        out.push(c);
      }
    });
    if (n === E + 68) out.push(Object.assign({}, MOVABLE.sacredHeart));
    if (n === E + 69) out.push(Object.assign({}, MOVABLE.immHeart));
    if (n === E + 50) out.push(Object.assign({}, MOVABLE.motherChurch));
    if (p.m === 11 && dow(n) === 4 && p.d >= 22 && p.d <= 28) out.push(Object.assign({}, MOVABLE.thanks));
    return out;
  }

  /* ---------- putting a day together ---------- */

  function getDay(n, opts) {
    opts = opts || {};
    var lang = LOC[opts.lang] ? opts.lang : 'en', L = LOC[lang];
    var p = parts(n), w = dow(n), t = temporal(n, !!opts.ascThu), s = sanctoral(n);

    // The Immaculate Heart becomes optional when it meets another obligatory memorial, and so does the other.
    var mems = s.filter(function (e) { return e.prec === 10; });
    if (mems.length > 1 && mems.some(function (e) { return e.id === 'immheart'; })) {
      mems.forEach(function (e) { e.prec = 12; e.rankKey = 'opt'; });
    }
    // Saturdays of Ordinary Time with nothing obligatory: optional memorial of the Blessed Virgin Mary.
    if (t.season === 'ordinary' && w === 6 && t.prec === 11 && !s.some(function (e) { return e.prec <= 10; })) {
      s.push(Object.assign({}, MOVABLE.bvmSat));
    }

    var all = [t].concat(s).sort(function (a, b) { return a.prec - b.prec; }); // stable: the season wins ties
    var win = all[0];
    var weekday = win.temporal && win.prec >= 9; // an ordinary or privileged weekday
    function nameOf(e) { return e.temporal ? L.n[e.key](e.a, e.b) : e.names[lang]; }

    var saints = s.map(function (e) {
      var status;
      if (e === win) status = 'celebrated';
      else if (weekday && e.prec >= 10) status = 'optional';
      else status = 'superseded';
      return {
        key: e.names.en, name: e.names[lang], title: e.titles[lang], rank: L.rank[e.rankKey],
        color: e.color, status: status, moved: !!e.moved, m: e.m || 0, d: e.d || 0
      };
    });

    var notes = [];
    if (t.noteKey === 'abstain') { if (win.prec > 3) notes.push(L.note.abstain); }
    else if (t.noteKey && win === t) notes.push(L.note[t.noteKey]);
    if (win.id === 'souls') notes.push(L.note.souls);
    if (win.id === 'unborn') notes.push(L.note.violetToo);
    if (win.moved) notes.push(L.note.moved);

    var obligation = false;
    if (w !== 0) {
      if (p.m === 12 && p.d === 25) obligation = true;
      else if (win.id === 'immaculate' && p.d === 8) obligation = true;
      else if (win.id === 'obl' && w !== 1 && w !== 6) obligation = true;
      else if (win.key === 'asc') obligation = true;
    }

    var litYear = n >= advent1(p.y) ? p.y + 1 : p.y;
    var code = pad(p.m) + pad(p.d) + pad(p.y % 100);
    return {
      n: n, iso: iso(n), year: p.y, month: p.m, day: p.d, dow: w, weekday: L.wd[w],
      season: t.season, seasonName: L.season[t.season],
      name: nameOf(win), rank: L.rank[win.rankKey], color: win.color,
      notes: notes, saints: saints, obligation: obligation,
      proper: w !== 0 && win.prec <= 7,
      // what a "learn more" link should point at: a feast on a fixed date, else the season (not Ordinary Time)
      about: (!win.temporal && win.m) ? { kind: 'saint', m: win.m, d: win.d }
        : (t.season !== 'ordinary' ? { kind: 'season' } : null),
      sundayCycle: ['C', 'A', 'B'][litYear % 3], weekdayCycle: litYear % 2 ? 'I' : 'II',
      readingsUrl: lang === 'es'
        ? 'https://bible.usccb.org/es/bible/lecturas/' + code + '.cfm'
        : 'https://bible.usccb.org/bible/readings/' + code + '.cfm'
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
