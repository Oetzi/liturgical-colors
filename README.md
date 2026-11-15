# Liturgical Colors

What to wear to Mass: the liturgical color, celebration, readings and saint for any date.
Roman Catholic calendar, Ordinary Form, for the dioceses of the United States. English and Spanish.

A static site with no build step and no server-side code. Open `index.html`, or serve the folder
with any static web server. `tests.html` runs the calendar checks in the browser.

## Files

- `index.html`, `styles.css`, `app.js` - the page
- `calendar.js` - the liturgical calendar calculations
- `saints.js` - fixed-date celebrations (English and Spanish)
- `i18n.js` - interface wording
- `bios.js` - short saint biographies
- `readings-2026.js`, `readings-2027.js` - Mass reading citations per day
- `scripture.js`, `bible/` - turns citations into Bible text
- `sw.js`, `manifest.webmanifest`, icons - install and offline support

## Sources

- Calendar and reading citations: USCCB, *Liturgical Calendar for the Dioceses of the United States of America* (2026, 2027)
- Bible text: World English Bible, Catholic edition (public domain; "World English Bible" is a trademark of eBible.org)
- Celebration links: Vatican News and USCCB
