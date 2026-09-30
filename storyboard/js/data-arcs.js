/* VAO Shotbook · Story arcs
 * Ready-made storyboards for the main kinds of property films.
 * Each beat explains why it exists; shots carry their full recipe.
 */
(function () {
  'use strict';
  var VAO = (window.VAO = window.VAO || {});
  var S = VAO.mkShot;
  var HANDS = { talent: 'Hands only' };

  var INTERIOR = ['living', 'kitchen', 'dining', 'bedroom', 'bathroom', 'stairs', 'detail'];
  VAO.ARCS = [
    {
      id: 'visit', name: 'The Visit', signature: true, for: 'Luxury villa · house', format: '16:9', target: 90, bpm: 80,
      feel: ['discovery', 'luxury', 'belonging'],
      blurb: 'VAO signature. The film follows a real visit: promise, arrival, compression at the door, release at the view, details, life, and a glowing farewell.',
      beats: [
        { name: 'Hook', why: 'Promise the ending in the first 3 seconds with the most desirable image.', shots: [
          S('Twilight glimpse', 'facade', 'ws', 'eye', 24, 'arc', 'blue', 3, 'dip', 'Promise: the house at its most desirable.'),
        ] },
        { name: 'Context', why: 'Where in the world: landscape, privacy, access.', shots: [
          S('Arriving from the hills', 'context', 'ews', 'bird', 24, 'pushin', 'golden', 6, 'dissolve', 'Location and privacy before the house.'),
          S('The plot from above', 'context', 'ws', 'top', 24, 'topdown', 'golden', 4, 'cut', 'The plot as a drawing: what you get.'),
        ] },
        { name: 'Arrival', why: 'The approach builds anticipation.', shots: [
          S('Up the cypress alley', 'arrival', 'ws', 'eye', 24, 'pushin', 'golden', 5, 'matchaction', 'Every step builds anticipation.'),
          S('Hand on the pivot door', 'entrance', 'insert', 'chest', 50, 'static', 'golden', 3, 'matchaction', 'Threshold: the touch and sound of the door.', { talent: 'Hands only', sound: 'Latch, gravel footsteps' }),
        ] },
        { name: 'Threshold', why: 'Compression: a short, darker, narrower moment makes the release feel bigger.', shots: [
          S('Behind the entry screen', 'entrance', 'pov', 'eye', 20, 'pushin', 'golden', 3, 'cut', 'Compression: the view is still hidden.', { sound: 'Music drops, ambience only' }),
        ] },
        { name: 'Reveal', why: 'Release: the volume and the view at once.', shots: [
          S('The reveal', 'living', 'ws', 'chest', 18, 'reveal', 'golden', 6, 'cut', 'Release: double height and pool through the glass.', { sound: 'Music returns on the reveal', keep: true }),
        ] },
        { name: 'Flow', why: 'How spaces connect. Keep one screen direction.', shots: [
          S('Through the open plan', 'living', 'ws', 'chest', 20, 'truck', 'golden', 5, 'cut', 'Parallax through the living space.'),
          S('Kitchen island', 'kitchen', 'mws', 'chest', 24, 'pedestal', 'golden', 4, 'cut', 'Where the family gathers.'),
          S('Dining under the light', 'dining', 'ms', 'chest', 35, 'pushin', 'golden', 4, 'matchcut', 'A table ready for guests.'),
        ] },
        { name: 'Intimacy', why: 'Details and private spaces: touch and comfort.', shots: [
          S('Zellige and marble', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 3, 'cut', 'Craft at 2 cm.'),
          S('Master suite', 'bedroom', 'ws', 'chest', 20, 'pushin', 'golden', 5, 'cut', 'The private retreat facing the view.'),
          S('Freestanding bath', 'bathroom', 'ms', 'chest', 35, 'arc', 'golden', 4, 'dissolve', 'A ritual, not a bathroom.'),
        ] },
        { name: 'Peak', why: 'The emotional high point: terrace, pool, view, life.', shots: [
          S('Out to the terrace', 'terrace', 'pov', 'eye', 20, 'pushthrough', 'golden', 5, 'cut', 'Crossing into the view.'),
          S('Golden hour by the pool', 'pool', 'mws', 'eye', 35, 'track', 'golden', 5, 'cut', 'The life you are buying.', { talent: 'Guest walking to the pool' }),
          S('The view, over the shoulder', 'view', 'ots', 'eye', 35, 'static', 'golden', 5, 'daynight', 'Sharing the gaze.', { talent: 'Back to camera' }),
        ] },
        { name: 'Farewell', why: 'Blue hour: the house glows; pull away to the logo.', shots: [
          S('Day to night', 'facade', 'ws', 'eye', 24, 'timelapse', 'golden', 6, 'dissolve', 'The house comes alive.'),
          S('Twilight pull-away', 'facade', 'ws', 'bird', 24, 'rise', 'blue', 7, 'end', 'Leave it glowing in its landscape. Logo and contact.'),
        ] },
      ],
    },
    {
      id: 'reel', name: 'Reel · Hook first', for: 'Any property · social', format: '9:16', target: 22, bpm: 120,
      feel: ['energy', 'luxury'],
      blurb: 'Vertical and fast. Best image first to stop the scroll, cut on the beat (1 bar = 2 s at 120 BPM), end on a glowing exterior with the call to action inside the safe zone.',
      beats: [
        { name: 'Hook', why: 'The first 1–3 seconds decide if people stay.', shots: [
          S('The money shot', 'facade', 'ws', 'eye', 24, 'arc', 'blue', 2, 'beat', 'Stop the scroll with the best image.'),
          S('Door opens', 'entrance', 'pov', 'eye', 20, 'pushthrough', 'golden', 1.5, 'whip', 'Instant movement into the house.'),
        ] },
        { name: 'Tour', why: 'One strong image per space, on the beat.', shots: [
          S('Living reveal', 'living', 'ws', 'chest', 18, 'reveal', 'golden', 2, 'beat', 'Volume and light.'),
          S('Kitchen detail', 'kitchen', 'cu', 'chest', 50, 'truck', 'golden', 1.5, 'beat', 'Quality in one glance.'),
          S('Master suite', 'bedroom', 'ws', 'chest', 20, 'pushin', 'golden', 2, 'beat', 'The private retreat.'),
          S('Bath ritual', 'bathroom', 'ms', 'chest', 35, 'static', 'golden', 1.5, 'beat', 'Spa at home.'),
        ] },
        { name: 'Payoff', why: 'The view and the life.', shots: [
          S('Pool and view', 'pool', 'ws', 'low', 16, 'speedramp', 'golden', 2.5, 'beat', 'The emotional peak.'),
          S('Lifestyle moment', 'terrace', 'mws', 'eye', 35, 'track', 'golden', 2, 'beat', 'Someone lives this.', { talent: 'Guest, back to camera' }),
        ] },
        { name: 'Close', why: 'Glow plus the information that converts.', shots: [
          S('Twilight aerial', 'context', 'ws', 'bird', 24, 'orbit', 'blue', 3, 'dip', 'Glow, location, price.'),
          S('End card', 'facade', 'ws', 'eye', 24, 'static', 'blue', 2, 'end', 'Logo and contact inside the safe zone.'),
        ] },
      ],
    },
    {
      id: 'day', name: 'A day in the life', for: 'Family home · lifestyle villa', format: '16:9', target: 60, bpm: 96,
      feel: ['belonging', 'welcome', 'calm'],
      blurb: 'Dawn to night. The property is shown through the hours and rituals of one day, which naturally schedules the shoot around the light.',
      beats: [
        { name: 'Dawn', why: 'Fresh light, still water, a new day.', shots: [
          S('First light on the facade', 'facade', 'ws', 'eye', 24, 'timelapse', 'dawn', 5, 'dissolve', 'The house wakes up.'),
          S('Mirror-still pool', 'pool', 'ws', 'low', 16, 'static', 'dawn', 5, 'cut', 'Silence and reflection.'),
        ] },
        { name: 'Morning', why: 'Rituals: coffee, breakfast.', shots: [
          S('Coffee on the terrace', 'terrace', 'mws', 'eye', 35, 'static', 'dawn', 4, 'cut', 'A ritual the buyer wants.', { talent: 'Couple' }),
          S('Breakfast at the island', 'kitchen', 'ms', 'chest', 35, 'truck', 'dawn', 4, 'jcut', 'The kitchen as the heart.', { talent: 'Family' }),
        ] },
        { name: 'Midday', why: 'Work and play in bright light.', shots: [
          S('Work with a view', 'living', 'ms', 'chest', 35, 'static', 'day', 4, 'cut', 'Remote work here.', { talent: 'Person at a laptop' }),
          S('Midday swim from above', 'pool', 'ws', 'top', 24, 'topdown', 'day', 4, 'cut', 'Turquoise water, top-down.', { talent: 'Swimmer' }),
        ] },
        { name: 'Golden hour', why: 'The warmest light for people and facades.', shots: [
          S('Reading on the lounger', 'pool', 'mws', 'eye', 35, 'arc', 'golden', 5, 'cut', 'Leisure.', { talent: 'Guest reading' }),
          S('Garden walk', 'garden', 'ws', 'eye', 35, 'track', 'golden', 5, 'cut', 'Space to roam.', { talent: 'Couple walking' }),
        ] },
        { name: 'Dusk', why: 'Lights on, people gather.', shots: [
          S('Dinner under the pergola', 'garden', 'ms', 'chest', 35, 'truck', 'blue', 5, 'cut', 'Friends and warm light.', { talent: 'Friends at the table' }),
          S('The house glowing', 'facade', 'ws', 'eye', 24, 'static', 'blue', 6, 'dissolve', 'Twilight hero.'),
        ] },
        { name: 'Night', why: 'Calm ending.', shots: [
          S('Fire and lamps', 'living', 'ms', 'chest', 35, 'pushin', 'night', 5, 'dissolve', 'Cosiness.'),
          S('Goodnight aerial', 'context', 'ws', 'bird', 24, 'rise', 'night', 6, 'end', 'The glowing house in the dark landscape.'),
        ] },
      ],
    },
    {
      id: 'architect', name: 'The architect’s eye', for: 'Architecture showcase · awards', format: '2.39:1', target: 90, bpm: 84,
      feel: ['design', 'calm', 'grandeur'],
      blurb: 'Reads the building like its architect: context, concept, approach, structure, light, materials, use, dusk. Level cameras, symmetry, long holds.',
      beats: [
        { name: 'Context', why: 'The site explains the design.', shots: [
          S('Site and landscape', 'context', 'ews', 'bird', 24, 'pushin', 'golden', 7, 'dissolve', 'The building answers its landscape.'),
          S('Massing from above', 'context', 'ws', 'top', 24, 'topdown', 'day', 6, 'plan', 'The concept as a plan.'),
        ] },
        { name: 'Approach', why: 'The designed sequence of arrival.', shots: [
          S('Axis of arrival', 'arrival', 'ws', 'eye', 28, 'static', 'dawn', 6, 'cut', 'Center framing on the architect’s axis.'),
          S('Entrance on axis', 'entrance', 'ws', 'eye', 24, 'pushin', 'dawn', 6, 'cut', 'Threshold as composition.'),
        ] },
        { name: 'Structure', why: 'How it stands: spans, cantilevers, rhythm.', shots: [
          S('Cantilever from below', 'facade', 'ws', 'worm', 14, 'static', 'golden', 5, 'cut', 'The daring of the structure.'),
          S('Rhythm of mullions', 'facade', 'ms', 'eye', 85, 'truck', 'golden', 6, 'cut', 'Compression turns the facade into pattern.'),
          S('Stair as sculpture', 'stairs', 'mws', 'chest', 20, 'pedestal', 'day', 6, 'cut', 'Diagonals and floating treads.'),
        ] },
        { name: 'Light', why: 'Light is the material of architecture.', shots: [
          S('Pergola shadows travel', 'garden', 'ms', 'eye', 35, 'timelapse', 'golden', 6, 'dissolve', 'Time written in shadow.'),
          S('Double height in daylight', 'living', 'ws', 'chest', 18, 'static', 'day', 6, 'cut', 'Volume filled with light.'),
        ] },
        { name: 'Materials', why: 'Honest materials, close up.', shots: [
          S('Timber and render', 'detail', 'cu', 'chest', 85, 'truck', 'golden', 4, 'cut', 'Warm against pale.'),
          S('Stone detail', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 4, 'cut', 'Texture at macro scale.'),
        ] },
        { name: 'Use', why: 'Architecture exists to be lived.', shots: [
          S('People inhabit the space', 'living', 'ws', 'chest', 24, 'static', 'golden', 6, 'cut', 'Scale and life.', { talent: 'Figures crossing the frame' }),
          S('The architect speaks', 'terrace', 'ms', 'eye', 50, 'static', 'golden', 8, 'cut', 'The intention in their words.', { talent: 'Architect interview', sound: 'Voice-over' }),
        ] },
        { name: 'Dusk', why: 'The building as a lantern.', shots: [
          S('Enfilade at dusk', 'living', 'ws', 'chest', 20, 'static', 'blue', 6, 'dissolve', 'Depth through lit rooms.'),
          S('Twilight elevation', 'facade', 'ws', 'eye', 24, 'static', 'blue', 8, 'end', 'The final image.'),
        ] },
      ],
    },
    {
      id: 'guest', name: 'Guest journey', for: 'Airbnb · boutique hotel', format: '9:16', target: 35, bpm: 104,
      feel: ['welcome', 'belonging'],
      blurb: 'The stay from the guest’s eyes: arrival, the door, the welcome, the rooms, the experience, the neighborhood, the night. Built to convert views into bookings.',
      beats: [
        { name: 'Arrival', why: 'Where you arrive and how easy it is.', shots: [
          S('The street and the door', 'street', 'ws', 'eye', 24, 'pushin', 'golden', 3, 'cut', 'Location, first impression.'),
          S('Key in the door', 'entrance', 'insert', 'chest', 50, 'static', 'golden', 2, 'matchaction', 'Check-in made tangible.', HANDS),
        ] },
        { name: 'Welcome', why: 'The moment of being expected.', shots: [
          S('The door opens', 'entrance', 'pov', 'eye', 20, 'pushthrough', 'golden', 3, 'cut', 'Guest POV.'),
          S('Welcome tray', 'dining', 'insert', 'chest', 50, 'pushin', 'golden', 2, 'cut', 'Attention to detail.'),
        ] },
        { name: 'Rooms', why: 'Comfort, cleanliness, amenities.', shots: [
          S('Living, lamps on', 'living', 'ws', 'chest', 20, 'truck', 'golden', 3, 'cut', 'Warm and spacious.'),
          S('Bed, ready for you', 'bedroom', 'ws', 'chest', 20, 'pushin', 'blue', 3, 'cut', 'The promise of good sleep.'),
          S('Towels and amenities', 'bathroom', 'cu', 'chest', 50, 'static', 'golden', 2, 'cut', 'Hotel-level care.'),
          S('Shower or bath', 'bathroom', 'ms', 'chest', 35, 'static', 'golden', 2.5, 'cut', 'Spa feeling.'),
        ] },
        { name: 'Experience', why: 'What you will do, not only where you sleep.', shots: [
          S('Pool or terrace', 'pool', 'mws', 'eye', 35, 'track', 'golden', 3, 'cut', 'Leisure.', { talent: 'Guest' }),
          S('Breakfast moment', 'terrace', 'ms', 'eye', 35, 'static', 'dawn', 3, 'cut', 'Morning ritual.', { talent: 'Couple' }),
        ] },
        { name: 'Neighborhood', why: 'What is around the corner.', shots: [
          S('Around the corner', 'street', 'ws', 'eye', 24, 'hyperlapse', 'day', 3, 'cut', 'Cafes, beach, medina.'),
        ] },
        { name: 'Night', why: 'Glow and call to action.', shots: [
          S('Night glow and booking CTA', 'facade', 'ws', 'eye', 24, 'static', 'blue', 4, 'end', 'Book now, inside the safe zone.'),
        ] },
      ],
    },
    {
      id: 'city', name: 'City apartment', for: 'Apartment · penthouse', format: '9:16', target: 32, bpm: 110,
      feel: ['energy', 'openness'],
      blurb: 'The neighborhood sells the flat: pulse of the city, the building, the door, the light and the view, then the skyline at night.',
      beats: [
        { name: 'Neighborhood', why: 'Location is the product.', shots: [
          S('City pulse', 'context', 'ews', 'bird', 24, 'hyperlapse', 'golden', 3, 'beat', 'The city in fast forward.'),
          S('Street life', 'street', 'ws', 'eye', 24, 'track', 'golden', 3, 'cut', 'Walkable life.', { talent: 'Resident walking' }),
        ] },
        { name: 'Building', why: 'Arrival and security.', shots: [
          S('Lobby entrance', 'entrance', 'ws', 'eye', 24, 'pushthrough', 'golden', 3, 'cut', 'The building’s quality.'),
          S('Door to the flat', 'entrance', 'insert', 'chest', 50, 'static', 'golden', 2, 'matchaction', 'Home.', HANDS),
        ] },
        { name: 'Living', why: 'Light and the view.', shots: [
          S('Living with the view', 'living', 'ws', 'chest', 20, 'reveal', 'golden', 4, 'cut', 'The reveal of the view.'),
          S('Kitchen details', 'kitchen', 'cu', 'chest', 50, 'truck', 'golden', 2.5, 'beat', 'Finishes.'),
        ] },
        { name: 'Private', why: 'Rest.', shots: [
          S('Bedroom', 'bedroom', 'ws', 'chest', 20, 'pushin', 'golden', 3, 'beat', 'Calm above the city.'),
          S('Bathroom detail', 'bathroom', 'cu', 'chest', 50, 'static', 'golden', 2, 'beat', 'Quality.'),
        ] },
        { name: 'Balcony', why: 'The city is yours.', shots: [
          S('Balcony at dusk', 'terrace', 'ots', 'eye', 35, 'static', 'blue', 4, 'cut', 'Shared gaze over the city.', { talent: 'Back to camera' }),
          S('Skyline at night', 'view', 'ws', 'eye', 24, 'timelapse', 'night', 4, 'end', 'Lights on across the city.'),
        ] },
      ],
    },
    {
      id: 'riad', name: 'Riad reveal', for: 'Riad · maison d’hôtes', format: '16:9', target: 50, bpm: 90,
      feel: ['heritage', 'discovery', 'calm'],
      blurb: 'Built on the riad’s own architecture of surprise: the busy medina, a closed door, the bent entrance that hides the courtyard, then light, water and sky.',
      beats: [
        { name: 'Medina', why: 'Contrast: noise and narrow streets before the calm.', shots: [
          S('Through the medina', 'street', 'ws', 'eye', 24, 'track', 'golden', 5, 'cut', 'The outside world, busy and narrow.', { talent: 'Guide walking ahead' }),
          S('The carved door', 'entrance', 'ws', 'eye', 28, 'pushin', 'golden', 4, 'matchaction', 'A closed, modest facade.'),
        ] },
        { name: 'Threshold', why: 'The bent entrance protects privacy and builds suspense.', shots: [
          S('Knocker and hand', 'entrance', 'insert', 'chest', 50, 'static', 'golden', 2, 'matchaction', 'The ritual of entering.', HANDS),
          S('The bent passage', 'entrance', 'pov', 'eye', 20, 'walkthrough', 'golden', 4, 'cut', 'Compression: dark and turning, the courtyard hidden.'),
        ] },
        { name: 'Courtyard', why: 'Release into light, water and sky.', shots: [
          S('Courtyard reveal', 'courtyard', 'ws', 'eye', 18, 'reveal', 'golden', 6, 'cut', 'Release: the heart of the house.'),
          S('Up to the sky', 'courtyard', 'ws', 'worm', 14, 'tilt', 'golden', 4, 'cut', 'The courtyard frames the sky.'),
        ] },
        { name: 'Craft', why: 'Zellige, plaster, cedar: centuries of skill.', shots: [
          S('Zellige and fountain', 'detail', 'ecu', 'chest', 100, 'truck', 'golden', 3, 'cut', 'Glaze and water.'),
          S('Carved plaster in light', 'detail', 'cu', 'chest', 85, 'static', 'golden', 3, 'cut', 'Pattern and shadow.'),
        ] },
        { name: 'Rooms', why: 'Arches and intimacy.', shots: [
          S('Salon through the arch', 'living', 'ws', 'chest', 24, 'pushthrough', 'golden', 4, 'cut', 'Frame within frame.'),
          S('Suite with lanterns', 'bedroom', 'ws', 'chest', 20, 'pushin', 'blue', 4, 'cut', 'Warm, textured rest.'),
        ] },
        { name: 'Rooftop & night', why: 'The medina skyline, then lanterns.', shots: [
          S('Rooftop at sunset', 'rooftop', 'ots', 'eye', 35, 'static', 'golden', 5, 'daynight', 'Minarets and the Atlas at dusk.', { talent: 'Guest with tea' }),
          S('Lanterns in the courtyard', 'courtyard', 'ws', 'top', 24, 'static', 'night', 5, 'end', 'The courtyard glows from above.'),
        ] },
      ],
    },
    {
      id: 'beforeafter', name: 'Before / after', for: 'Renovation · staging', format: '9:16', target: 27, bpm: 100,
      feel: ['clarity', 'craft'],
      blurb: 'Proof of transformation. Identical tripod marks, lens and height for every pair so the wipe is undeniable.',
      beats: [
        { name: 'Hook', why: 'Show the result first.', shots: [
          S('The finished hero', 'facade', 'ws', 'eye', 24, 'arc', 'golden', 3, 'cut', 'The result that justifies watching.'),
        ] },
        { name: 'Pairs', why: 'Same frame, two states.', shots: [
          S('Before · facade', 'facade', 'ws', 'eye', 24, 'static', 'day', 2, 'beforeafter', 'Tripod mark A.'),
          S('After · facade', 'facade', 'ws', 'eye', 24, 'static', 'golden', 3, 'cut', 'Same mark, new life.'),
          S('Before · living', 'living', 'ws', 'chest', 20, 'static', 'day', 2, 'beforeafter', 'Tripod mark B.'),
          S('After · living', 'living', 'ws', 'chest', 20, 'static', 'golden', 3, 'cut', 'Same mark, finished.'),
          S('Before · kitchen', 'kitchen', 'ws', 'chest', 20, 'static', 'day', 2, 'beforeafter', 'Tripod mark C.'),
          S('After · kitchen', 'kitchen', 'ws', 'chest', 20, 'static', 'golden', 3, 'cut', 'Same mark, finished.'),
        ] },
        { name: 'Details', why: 'The quality of the work.', shots: [
          S('New materials', 'detail', 'ecu', 'chest', 100, 'truck', 'any', 2.5, 'cut', 'Finishes up close.'),
          S('Craftsman’s hands', 'detail', 'insert', 'chest', 50, 'static', 'any', 2.5, 'cut', 'The people behind it.', { talent: 'Craftsman' }),
        ] },
        { name: 'Close', why: 'Credit and contact.', shots: [
          S('Twilight after', 'facade', 'ws', 'eye', 24, 'static', 'blue', 4, 'end', 'Studio and contact.'),
        ] },
      ],
    },
    {
      id: 'offplan', name: 'Off-plan to reality', for: 'New build · developer', format: '16:9', target: 47, bpm: 90,
      feel: ['clarity', 'design'],
      blurb: 'From promise to proof: render and plan, the site from identical drone waypoints, the craft, then the render dissolving into the finished building.',
      beats: [
        { name: 'Vision', why: 'Start from the promise.', shots: [
          S('The render', 'facade', 'ws', 'eye', 24, 'static', 'golden', 4, 'dissolve', 'The promised image.'),
          S('Plan over the plot', 'context', 'ws', 'top', 24, 'topdown', 'day', 5, 'plan', 'The drawing on the real land.'),
        ] },
        { name: 'Site', why: 'Progress, measured.', shots: [
          S('Site from the air', 'context', 'ews', 'bird', 24, 'orbit', 'dawn', 5, 'cut', 'Same drone waypoint every month.'),
          S('Structure rising', 'facade', 'ws', 'eye', 24, 'timelapse', 'day', 5, 'cut', 'Construction timelapse.'),
        ] },
        { name: 'Craft', why: 'Trust in the builders.', shots: [
          S('Craftsmen at work', 'detail', 'ms', 'eye', 35, 'handheld', 'day', 3, 'cut', 'Real people, real work.', { talent: 'Workers (with releases)' }),
          S('Material close-up', 'detail', 'ecu', 'chest', 100, 'truck', 'day', 3, 'cut', 'Specification made visible.'),
        ] },
        { name: 'Reality', why: 'The promise kept.', shots: [
          S('Render to reality', 'facade', 'ws', 'eye', 24, 'static', 'golden', 5, 'dissolve', 'Same framing as the render.'),
          S('First walk inside', 'living', 'ws', 'chest', 20, 'walkthrough', 'golden', 8, 'cut', 'Show unit, one take.'),
          S('Finishes', 'kitchen', 'cu', 'chest', 50, 'truck', 'golden', 3, 'cut', 'Details buyers ask about.'),
        ] },
        { name: 'Close', why: 'The development at its best.', shots: [
          S('Development at blue hour', 'context', 'ws', 'bird', 24, 'rise', 'blue', 6, 'end', 'Sales office contact.'),
        ] },
      ],
    },
    {
      id: 'land', name: 'Land & plot', for: 'Land · plots', format: '16:9', target: 30, bpm: 96,
      feel: ['clarity', 'retreat'],
      blurb: 'Nothing is built yet, so sell location, boundaries, access and the future view from the height of the future living room.',
      beats: [
        { name: 'Where', why: 'Region and access.', shots: [
          S('The region', 'context', 'ews', 'bird', 24, 'pushin', 'golden', 5, 'dissolve', 'Landscape and distance to places that matter.'),
          S('Plot boundaries', 'context', 'ws', 'top', 24, 'topdown', 'day', 5, 'plan', 'Outline, north arrow and area in post.'),
          S('Access road', 'street', 'ws', 'bird', 24, 'track', 'day', 4, 'cut', 'How you get there.'),
        ] },
        { name: 'Future', why: 'Help them imagine the house.', shots: [
          S('The future view', 'view', 'ws', 'eye', 24, 'rise', 'golden', 6, 'cut', 'Drone at future living height (3–6 m).'),
          S('What is around', 'context', 'ews', 'bird', 24, 'orbit', 'golden', 5, 'cut', 'Neighbors, sea, mountains, town.'),
          S('Sunset over the land', 'context', 'ws', 'eye', 24, 'timelapse', 'golden', 5, 'end', 'Emotion and contact.'),
        ] },
      ],
    },
    {
      id: 'agent', name: 'Agent-led tour', for: 'Listing with presenter', format: '16:9', target: 66, bpm: 100,
      feel: ['welcome', 'clarity'],
      blurb: 'A presenter guides the visit with walk-and-talk sections, cut with B-roll every few seconds so the property stays the star.',
      beats: [
        { name: 'Intro', why: 'Who, where, why this home.', shots: [
          S('Agent at the gate', 'arrival', 'mws', 'eye', 35, 'static', 'golden', 8, 'cut', 'Hook line on camera.', { talent: 'Agent to camera' }),
        ] },
        { name: 'Walk & talk', why: 'Guided route with cutaways.', shots: [
          S('Walk to the door', 'entrance', 'mws', 'eye', 24, 'track', 'golden', 10, 'cut', 'Presenter leads.', { talent: 'Agent walking' }),
          S('Living B-roll', 'living', 'ws', 'chest', 20, 'truck', 'golden', 4, 'jcut', 'Cutaway under the voice.'),
          S('Agent in the living room', 'living', 'mws', 'chest', 24, 'handheld', 'golden', 10, 'cut', 'Key facts.', { talent: 'Agent' }),
          S('Kitchen B-roll', 'kitchen', 'cu', 'chest', 50, 'truck', 'golden', 3, 'cut', 'Finishes.'),
        ] },
        { name: 'Features', why: 'The two or three reasons to buy.', shots: [
          S('Feature: the view', 'view', 'ots', 'eye', 35, 'static', 'golden', 6, 'cut', 'Presenter shares the view.', { talent: 'Agent, back to camera' }),
          S('Bedrooms B-roll', 'bedroom', 'ws', 'chest', 20, 'pushin', 'golden', 4, 'cut', 'Private spaces.'),
          S('Feature: the pool', 'pool', 'mws', 'eye', 35, 'track', 'golden', 8, 'cut', 'Lifestyle pitch.', { talent: 'Agent' }),
        ] },
        { name: 'Call to action', why: 'Next step.', shots: [
          S('Agent outro', 'terrace', 'ms', 'eye', 50, 'static', 'golden', 8, 'cut', 'Book a visit.', { talent: 'Agent to camera' }),
          S('Twilight and contact', 'facade', 'ws', 'eye', 24, 'static', 'blue', 5, 'end', 'Contact card.'),
        ] },
      ],
    },
  ];
  VAO.ARCS.forEach(function (a) {
    a.beats.forEach(function (b) {
      b.shots.forEach(function (s) { if (INTERIOR.indexOf(s.space) >= 0 && s.light === 'golden' && !s.keep) s.light = 'any'; });
    });
  });
  VAO.ARCMAP = {};
  VAO.ARCS.forEach(function (a) { VAO.ARCMAP[a.id] = a; });
})();
