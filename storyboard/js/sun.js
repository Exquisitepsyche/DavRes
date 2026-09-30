/* VAO Shotbook · Sun planner maths
 * Solar position after the standard low-precision algorithm (accurate to a
 * fraction of a degree, a minute or two for event times), plus golden/blue
 * hour windows (PhotoPills convention: golden +6° to -4°, blue -4° to -6°)
 * and facade exposure.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});
  var rad = Math.PI / 180, dayMs = 86400000, J1970 = 2440588, J2000 = 2451545;
  var e = rad * 23.4397;

  function toDays(date) { return date.valueOf() / dayMs - 0.5 + J1970 - J2000; }
  function rightAscension(l) { return Math.atan2(Math.sin(l) * Math.cos(e), Math.cos(l)); }
  function declination(l) { return Math.asin(Math.sin(e) * Math.sin(l)); }
  function meanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclipticLongitude(M) {
    var C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    return M + C + rad * 102.9372 + Math.PI;
  }

  // Returns { altitude, azimuth } in degrees. Azimuth is a compass bearing
  // (0 = north, 90 = east, 180 = south, 270 = west).
  function position(date, lat, lng) {
    var lw = rad * -lng, phi = rad * lat, d = toDays(date);
    var M = meanAnomaly(d), L = eclipticLongitude(M);
    var dec = declination(L), ra = rightAscension(L);
    var H = rad * (280.16 + 360.9856235 * d) - lw - ra;
    var alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
    var az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
    return { altitude: alt / rad, azimuth: ((az / rad + 180) % 360 + 360) % 360 };
  }

  var deviceTz = (function () {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (err) { return 'UTC'; }
  })();

  // Minutes the zone is ahead of UTC at a given instant.
  function tzOffset(date, tz) {
    try {
      var dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
      var p = {};
      dtf.formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
      var asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
      return Math.round((asUTC - date.getTime()) / 60000);
    } catch (err) {
      return -date.getTimezoneOffset();
    }
  }

  // UTC instant of local midnight for YYYY-MM-DD in a zone.
  function localMidnight(ymd, tz) {
    var parts = ymd.split('-').map(Number);
    var guess = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    var off = tzOffset(new Date(guess), tz);
    var t = guess - off * 60000;
    var off2 = tzOffset(new Date(t), tz);
    if (off2 !== off) t = guess - off2 * 60000;
    return new Date(t);
  }

  function fmtTime(date, tz) {
    if (!date) return '—';
    try {
      return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
    } catch (err) {
      return date.toISOString().slice(11, 16);
    }
  }

  function angleDiff(a, b) { return Math.abs(((a - b + 540) % 360) - 180); }

  /* Full day analysis. facade = compass bearing the facade faces (optional). */
  function day(ymd, lat, lng, tz, facade) {
    tz = tz || deviceTz;
    var start = localMidnight(ymd, tz);
    var samples = [];
    for (var i = 0; i <= 1440; i++) {
      var t = new Date(start.getTime() + i * 60000);
      var p = position(t, lat, lng);
      samples.push({ t: t, min: i, alt: p.altitude, az: p.azimuth });
    }
    function crossings(level) {
      var ups = [], downs = [];
      for (var k = 1; k < samples.length; k++) {
        var a = samples[k - 1], b = samples[k];
        if ((a.alt - level) * (b.alt - level) <= 0 && a.alt !== b.alt) {
          var f = (level - a.alt) / (b.alt - a.alt);
          var tt = new Date(a.t.getTime() + f * 60000);
          if (b.alt > a.alt) ups.push(tt); else downs.push(tt);
        }
      }
      return { up: ups[0] || null, down: downs[downs.length - 1] || null };
    }
    var rise = crossings(-0.833), g6 = crossings(6), b4 = crossings(-4), c6 = crossings(-6);
    var noon = samples.reduce(function (m, s) { return s.alt > m.alt ? s : m; }, samples[0]);
    var res = {
      tz: tz, samples: samples, start: start,
      sunrise: rise.up, sunset: rise.down, noon: noon.t, noonAlt: noon.alt,
      morningBlue: [c6.up, b4.up], morningGolden: [b4.up, g6.up],
      eveningGolden: [g6.down, b4.down], eveningBlue: [b4.down, c6.down],
      dayLength: rise.up && rise.down ? (rise.down - rise.up) / 60000 : null,
    };
    if (facade != null) {
      var lit = [], cur = null;
      samples.forEach(function (s) {
        var on = s.alt > 0.5 && angleDiff(s.az, facade) < 85;
        if (on && !cur) cur = { from: s.t, to: s.t, best: null };
        if (on) {
          cur.to = s.t;
          // raking warm light: sun low and within 60° of the facade normal
          if (s.alt < 22 && angleDiff(s.az, facade) < 65 && !cur.best) cur.best = s.t;
        }
        if (!on && cur) { lit.push(cur); cur = null; }
      });
      if (cur) lit.push(cur);
      res.facadeLit = lit;
      // hero window: overlap of facade light with the golden hours
      var hero = [];
      [res.morningGolden, res.eveningGolden].forEach(function (w) {
        if (!w[0] || !w[1]) return;
        var a = w[0] < w[1] ? w[0] : w[1], b = w[0] < w[1] ? w[1] : w[0];
        lit.forEach(function (l) {
          var from = new Date(Math.max(a, l.from)), to = new Date(Math.min(b, l.to));
          if (to - from > 4 * 60000) hero.push([from, to]);
        });
      });
      res.hero = hero;
    }
    return res;
  }

  VAO.Sun = {
    position: position, day: day, fmt: fmtTime, tzOffset: tzOffset, deviceTz: deviceTz, angleDiff: angleDiff,
    localMidnight: localMidnight,
    CITIES: [
      { name: 'Marrakech', lat: 31.6295, lng: -7.9811, tz: 'Africa/Casablanca' },
      { name: 'Casablanca', lat: 33.5731, lng: -7.5898, tz: 'Africa/Casablanca' },
      { name: 'Rabat', lat: 34.0209, lng: -6.8416, tz: 'Africa/Casablanca' },
      { name: 'Tangier', lat: 35.7595, lng: -5.834, tz: 'Africa/Casablanca' },
      { name: 'Agadir', lat: 30.4278, lng: -9.5981, tz: 'Africa/Casablanca' },
      { name: 'Fès', lat: 34.0181, lng: -5.0078, tz: 'Africa/Casablanca' },
      { name: 'Essaouira', lat: 31.5085, lng: -9.7595, tz: 'Africa/Casablanca' },
      { name: 'Paris', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris' },
      { name: 'Nice', lat: 43.7102, lng: 7.262, tz: 'Europe/Paris' },
      { name: 'Madrid', lat: 40.4168, lng: -3.7038, tz: 'Europe/Madrid' },
      { name: 'Lisbon', lat: 38.7223, lng: -9.1393, tz: 'Europe/Lisbon' },
      { name: 'London', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
      { name: 'Dubai', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
      { name: 'New York', lat: 40.7128, lng: -74.006, tz: 'America/New_York' },
      { name: 'Miami', lat: 25.7617, lng: -80.1918, tz: 'America/New_York' },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
    ],
  };
})();
