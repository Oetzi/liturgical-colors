/*
 * Turns a Lectionary citation ("Is 61:1-3a, 6a, 8b-9") into Bible text.
 *
 * The text is the World English Bible, Catholic edition (public domain), one file per book in bible/.
 * Lectionary citations follow the New American Bible, whose chapter and verse numbers differ from the
 * World English Bible in some Old Testament books; RULES converts between the two.
 */
(function (root) {
  'use strict';

  var BOOKS = {
    Gn: 'GEN', Ex: 'EXO', Lv: 'LEV', Nm: 'NUM', Dt: 'DEU', Jos: 'JOS', Jgs: 'JDG', Ru: 'RUT',
    '1 Sm': '1SA', '2 Sm': '2SA', '1 Kgs': '1KI', '2 Kgs': '2KI', '1 Chr': '1CH', '2 Chr': '2CH',
    Ezr: 'EZR', Neh: 'NEH', Tb: 'TOB', Jdt: 'JDT', Est: 'ESG', '1 Mc': '1MA', '2 Mc': '2MA',
    Jb: 'JOB', Ps: 'PSA', Pss: 'PSA', Prv: 'PRO', Eccl: 'ECC', Sg: 'SOL', Wis: 'WIS', Sir: 'SIR',
    Is: 'ISA', Jer: 'JER', Lam: 'LAM', Bar: 'BAR', Ez: 'EZE', Dn: 'DNG', Dan: 'DNG', Hos: 'HOS', Jl: 'JOE',
    Am: 'AMO', Ob: 'OBA', Jon: 'JON', Mi: 'MIC', Na: 'NAH', Hb: 'HAB', Zep: 'ZEP', Hg: 'HAG',
    Zec: 'ZEC', Mal: 'MAL', Mt: 'MAT', Mk: 'MAR', Lk: 'LUK', Jn: 'JOH', Acts: 'ACT', Rom: 'ROM',
    '1 Cor': '1CO', '2 Cor': '2CO', Gal: 'GAL', Eph: 'EPH', Phil: 'PHI', Col: 'COL',
    '1 Thes': '1TH', '2 Thes': '2TH', '1 Tm': '1TI', '2 Tm': '2TI', Ti: 'TIT', Phlm: 'PHM',
    Heb: 'HEB', Jas: 'JAM', '1 Pt': '1PE', '2 Pt': '2PE', '1 Jn': '1JO', '2 Jn': '2JO', '3 Jn': '3JO',
    Jude: 'JUD', Rv: 'REV'
  };
  // Full English names, for showing a citation in words rather than abbreviations.
  var NAMES = {
    Gn: 'Genesis', Ex: 'Exodus', Lv: 'Leviticus', Nm: 'Numbers', Dt: 'Deuteronomy', Jos: 'Joshua', Jgs: 'Judges', Ru: 'Ruth',
    '1 Sm': '1 Samuel', '2 Sm': '2 Samuel', '1 Kgs': '1 Kings', '2 Kgs': '2 Kings', '1 Chr': '1 Chronicles', '2 Chr': '2 Chronicles',
    Ezr: 'Ezra', Neh: 'Nehemiah', Tb: 'Tobit', Jdt: 'Judith', Est: 'Esther', '1 Mc': '1 Maccabees', '2 Mc': '2 Maccabees',
    Jb: 'Job', Ps: 'Psalm', Pss: 'Psalms', Prv: 'Proverbs', Eccl: 'Ecclesiastes', Sg: 'Song of Songs', Wis: 'Wisdom', Sir: 'Sirach',
    Is: 'Isaiah', Jer: 'Jeremiah', Lam: 'Lamentations', Bar: 'Baruch', Ez: 'Ezekiel', Dn: 'Daniel', Dan: 'Daniel', Hos: 'Hosea', Jl: 'Joel',
    Am: 'Amos', Ob: 'Obadiah', Jon: 'Jonah', Mi: 'Micah', Na: 'Nahum', Hb: 'Habakkuk', Zep: 'Zephaniah', Hg: 'Haggai',
    Zec: 'Zechariah', Mal: 'Malachi', Mt: 'Matthew', Mk: 'Mark', Lk: 'Luke', Jn: 'John', Acts: 'Acts', Rom: 'Romans',
    '1 Cor': '1 Corinthians', '2 Cor': '2 Corinthians', Gal: 'Galatians', Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians',
    '1 Thes': '1 Thessalonians', '2 Thes': '2 Thessalonians', '1 Tm': '1 Timothy', '2 Tm': '2 Timothy', Ti: 'Titus', Phlm: 'Philemon',
    Heb: 'Hebrews', Jas: 'James', '1 Pt': '1 Peter', '2 Pt': '2 Peter', '1 Jn': '1 John', '2 Jn': '2 John', '3 Jn': '3 John',
    Jude: 'Jude', Rv: 'Revelation'
  };
  // "Mt 1:1-25 or 1:18-25" -> "Matthew 1:1-25 or 1:18-25"; each option after "or" is expanded too.
  function fullName(cite) {
    return cite.split(/ or /).map(function (alt) {
      var m = /^((?:[1-3] )?[A-Za-z]+) (.+)$/.exec(alt.trim());
      return m && NAMES[m[1]] ? NAMES[m[1]] + ' ' + m[2] : alt.trim();
    }).join(' or ');
  }
  var SINGLE = { OBA: 1, PHM: 1, '2JO': 1, '3JO': 1, JUD: 1 };
  var GOSPELS ={ MAT: 1, MAR: 1, LUK: 1, JOH: 1 };
  // Books translated from a different ancient text, where verses will not always line up.
  var APPROX = { TOB: 1, SIR: 1, ESG: 1 };

  // [book, NAB chapter, from verse, to verse, WEB chapter, amount to add to the verse number]
  var RULES = [
    ['GEN', 32, 1, 1, 31, 54], ['GEN', 32, 2, 33, 32, -1],
    ['EXO', 7, 26, 29, 8, -25], ['EXO', 8, 1, 28, 8, 4], ['EXO', 21, 37, 37, 22, -36], ['EXO', 22, 1, 30, 22, 1],
    ['LEV', 5, 20, 26, 6, -19], ['LEV', 6, 1, 23, 6, 7],
    ['NUM', 17, 1, 15, 16, 35], ['NUM', 17, 16, 28, 17, -15], ['NUM', 30, 1, 1, 29, 39], ['NUM', 30, 2, 17, 30, -1],
    ['DEU', 13, 1, 1, 12, 31], ['DEU', 13, 2, 19, 13, -1], ['DEU', 23, 1, 1, 22, 29], ['DEU', 23, 2, 26, 23, -1],
    ['DEU', 28, 69, 69, 29, -68], ['DEU', 29, 1, 28, 29, 1],
    ['1SA', 21, 1, 1, 20, 41], ['1SA', 21, 2, 16, 21, -1], ['1SA', 24, 1, 1, 23, 28], ['1SA', 24, 2, 23, 24, -1],
    ['2SA', 19, 1, 1, 18, 32], ['2SA', 19, 2, 44, 19, -1],
    ['1KI', 5, 1, 14, 4, 20], ['1KI', 5, 15, 32, 5, -14],
    ['2KI', 12, 1, 1, 11, 20], ['2KI', 12, 2, 22, 12, -1],
    ['1CH', 5, 27, 41, 6, -26], ['1CH', 6, 1, 66, 6, 15],
    ['2CH', 1, 18, 18, 2, -17], ['2CH', 2, 1, 17, 2, 1], ['2CH', 13, 23, 23, 14, -22], ['2CH', 14, 1, 14, 14, 1],
    ['NEH', 3, 33, 38, 4, -32], ['NEH', 4, 1, 17, 4, 6], ['NEH', 10, 1, 1, 9, 37], ['NEH', 10, 2, 40, 10, -1],
    ['JOB', 40, 25, 32, 41, -24], ['JOB', 41, 1, 26, 41, 8],
    ['ECC', 4, 17, 17, 5, -16], ['ECC', 5, 1, 19, 5, 1],
    ['SOL', 7, 1, 1, 6, 12], ['SOL', 7, 2, 14, 7, -1],
    ['ISA', 8, 23, 23, 9, -22], ['ISA', 9, 1, 20, 9, 1], ['ISA', 64, 1, 11, 64, 1],
    ['JER', 8, 23, 23, 9, -22], ['JER', 9, 1, 25, 9, 1],
    ['EZE', 21, 1, 5, 20, 44], ['EZE', 21, 6, 37, 21, -5],
    ['DNG', 3, 98, 100, 4, -97], ['DNG', 4, 1, 34, 4, 3], ['DNG', 6, 1, 1, 5, 30], ['DNG', 6, 2, 29, 6, -1],
    ['HOS', 2, 1, 2, 1, 9], ['HOS', 2, 3, 25, 2, -2], ['HOS', 12, 1, 1, 11, 11], ['HOS', 12, 2, 15, 12, -1],
    ['HOS', 14, 1, 1, 13, 15], ['HOS', 14, 2, 10, 14, -1],
    ['JOE', 3, 1, 5, 2, 27], ['JOE', 4, 1, 21, 3, 0],
    ['JON', 2, 1, 1, 1, 16], ['JON', 2, 2, 11, 2, -1],
    ['MIC', 4, 14, 14, 5, -13], ['MIC', 5, 1, 14, 5, 1],
    ['NAH', 2, 1, 1, 1, 14], ['NAH', 2, 2, 14, 2, -1],
    ['ZEC', 2, 1, 4, 1, 17], ['ZEC', 2, 5, 17, 2, -4],
    ['MAL', 3, 19, 24, 4, -18],
    // Romans: this Bible prints the closing doxology at the end of chapter 14
    ['ROM', 16, 25, 27, 14, -1],
    // Esther: the Lectionary's addition C is printed after 4:17 in this Bible
    ['ESG', 'C', 1, 30, 4, 17]
  ];

  function toWeb(code, ch, v) {
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (r[0] === code && r[1] === ch && v >= r[2] && v <= r[3]) return [r[4], v + r[5]];
    }
    return claimed(code, ch, v) ? null : [ch, v];
  }
  // True when a rule from another Lectionary chapter lands on this spot, so it is not this chapter's verse.
  function claimed(code, ch, v) {
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      if (r[0] === code && r[4] === ch && v >= r[2] + r[5] && v <= r[3] + r[5]) return true;
    }
    return false;
  }
  function data(code) { return (root.LITCAL_BIBLE || {})[/^\d/.test(code) ? 'B' + code : code]; }
  function verseText(code, ch, v) {
    var w = toWeb(code, ch, v), book = data(code), chap = w && book && book[w[0]];
    return (chap && chap[w[1] - 1]) || '';
  }

  // "Is 42:1-4, 6-7" -> { book: 'Is', code: 'ISA', ranges: [[42,1,42,4],[42,6,42,7]] }
  function parse(ref) {
    var m = /^((?:[1-3] )?[A-Za-z]+) (.+)$/.exec(ref.trim());
    if (!m || !BOOKS[m[1]]) return null;
    // one-chapter books are cited by verse alone ("Jude 17, 20b-25")
    var cur = SINGLE[BOOKS[m[1]]] ? 1 : null, ranges = [], bad = false;
    function point(s) {
      var p = /^(?:([0-9]+|[A-F]):)?([0-9]+)[a-e]*$/.exec(s.trim());
      if (!p) { bad = true; return null; }
      if (p[1]) cur = /^[0-9]+$/.test(p[1]) ? +p[1] : p[1];
      if (cur === null) { bad = true; return null; }
      return [cur, +p[2]];
    }
    m[2].split(/[;,]/).forEach(function (item) {
      if (bad || !item.trim()) return;
      var ends = item.split(/[-–—]/), a = point(ends[0]), b = ends.length > 1 ? point(ends[1]) : a;
      if (a && b) ranges.push([a[0], a[1], b[0], b[1]]);
    });
    return bad || !ranges.length ? null : { book: m[1], code: BOOKS[m[1]], ranges: ranges, gospel: !!GOSPELS[BOOKS[m[1]]], approx: !!APPROX[BOOKS[m[1]]] };
  }

  // The verses of a parsed passage, in order: [{ ch, v, text }]. The book must be loaded.
  function verses(p) {
    var out = [];
    p.ranges.forEach(function (r) {
      var ch = r[0], v = r[1], guard = 0;
      while (guard++ < 400) {
        var t = verseText(p.code, ch, v);
        if (!t) {
          // some verses are absent from this Bible (not in the oldest manuscripts): step over a small gap
          var skip = 0;
          for (var g = 1; g <= 3 && !skip; g++) if (verseText(p.code, ch, v + g)) skip = g;
          if (skip && (ch !== r[2] || v + skip <= r[3])) { v += skip; continue; }
          // past the end of a chapter: carry on into the next one if the range crosses chapters
          if (typeof ch !== 'number' || ch >= r[2]) break;
          ch++; v = 1;
          if (!verseText(p.code, ch, v)) break;
          continue;
        }
        out.push({ ch: ch, v: v, text: t });
        if (ch === r[2] && v >= r[3]) break;
        v++;
      }
    });
    return out;
  }

  // One day's citation string for one Mass -> the passages to show (the first option of each reading).
  function passages(cites) {
    return cites.split(/ or, in Year/)[0].split('/').map(function (part) {
      var first = part.split(/ or /)[0].trim();
      // whole: the reading with its options, in words; cite: the option whose text is shown
      return { cite: fullName(first), whole: fullName(part.trim()), parsed: parse(first) };
    });
  }

  var loading = {};
  function load(code) {
    if (data(code)) return Promise.resolve();
    if (!loading[code]) {
      loading[code] = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = 'bible/' + code + '.js';
        s.onload = function () { resolve(); };
        s.onerror = function () { delete loading[code]; reject(new Error('Could not load ' + code)); };
        document.head.appendChild(s);
      });
    }
    return loading[code];
  }
  function allFiles() {
    var seen = {}, out = [];
    Object.keys(BOOKS).forEach(function (k) { if (!seen[BOOKS[k]]) { seen[BOOKS[k]] = 1; out.push('bible/' + BOOKS[k] + '.js'); } });
    return out;
  }

  root.LitScripture = { parse: parse, verses: verses, passages: passages, load: load, allFiles: allFiles, fullName: fullName };
})(typeof window !== 'undefined' ? window : globalThis);
