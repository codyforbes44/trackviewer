## Goal

Bring the `/site-survey` map up to "best-in-class" production quality: sharper imagery, more reliable terrain analysis, a polished mobile-first layout, and every toggle/style/feature verified working.

## Problems in the current page

1. **Imagery quality**
   - Uses legacy v12 raster styles only. `mapbox/satellite-v9` and `satellite-streets-v12` look soft compared to Mapbox Standard / Standard Satellite (v3 vector styles with PBR lighting, crisp 3D buildings, and high-res imagery).
   - Map is created without `pixelRatio`/devicePixelRatio handling, so tiles render blurry on Retina/4K screens.
   - No max zoom override — satellite imagery caps too early in some regions.

2. **Terrain analysis is flaky**
   - `queryTerrainElevation` is called inside a single `idle` callback. At zoom 17, DEM tiles often haven't loaded yet, so elevation/slope return `null` on the first click and never retry.
   - Aspect math uses `atan2(dzdy, -dzdx)` which yields wrong compass direction in some quadrants (should be `atan2(-dzdy, dzdx)` to get true bearing from north).

3. **Layer toggles break across style switches**
   - `setStyle` wipes sources/layers. The `style.load` handler re-adds DEM/contours/hillshade/buildings/sky — but the click handler, marker, and currently selected pin position are not restored, so after switching style the site info disappears and the marker vanishes.
   - 3D Buildings toggle fails silently on Standard styles (they already include 3D buildings via the style's own config), causing duplicate/missing geometry.
   - Sky layer is added on every style load even when style already provides one (Standard).

4. **Mobile UX is weak**
   - Style switcher row wraps and overlaps Mapbox's nav/geolocate controls on small screens.
   - Search input + suggestions push the map down; map shrinks to <50% of viewport.
   - Map height (`70vh min-h-[480px]`) plus a stacked info card forces excessive scrolling on phones. No bottom-sheet pattern like `MobileMapSheet`.
   - Layer toggles card sits below the map on mobile — invisible without scrolling.

5. **Misc polish**
   - Contour colors (`#a0522d`, `#5c2018`) are hard-coded and invisible on dark satellite/dark styles.
   - Sun-sync `setPaintProperty('sky', …)` throws on Standard styles (no `sky` layer); errors swallowed but feature silently broken.
   - No loading state while DEM warms up; no error toast when elevation can't be sampled.
   - Geocoder doesn't accept raw `lat,lng` input despite the placeholder advertising it.

## Plan

### 1. Upgrade map engine & imagery

- Replace style list with Mapbox v3 Standard family:
  - **Standard** (`mapbox://styles/mapbox/standard`) — default, with `lightPreset` bound to theme (`day` / `dusk` / `night`).
  - **Standard Satellite** (`mapbox://styles/mapbox/standard-satellite`) — primary high-res satellite.
  - Keep `outdoors-v12` for topographic contour view, `streets-v12`, and `dark-v11` as compact fallbacks.
- Initialize map with `pixelRatio: window.devicePixelRatio`, `maxZoom: 22`, `antialias: true`, `projection: 'globe'`, `optimizeForTerrain: true`, `respectPrefersReducedMotion: true`.
- Add a `transformRequest` hook to bypass image-tiles cache busting and force `@2x` raster variants where applicable.

### 2. Reliable terrain queries

- Replace one-shot `idle` with a `waitForTerrain(lng,lat)` helper that polls `queryTerrainElevation` up to ~1.5s (every 100ms) before giving up.
- Fix aspect math to true compass bearing; verify on a known slope.
- Show "Sampling terrain…" placeholder + spinner in the Terrain tab while polling; toast a friendly message if DEM unavailable for the region.

### 3. Layer system that survives style switches

- Move all custom additions (DEM, hillshade, contours, sky-sun-sync) into a single `applyCustomLayers()` invoked from a persistent `style.load` listener registered once.
- Detect Standard styles via `m.getStyle().name`/imports and:
  - Skip adding `3d-buildings` (use the style's `show3dObjects` config slot via `m.setConfigProperty('basemap', 'show3dObjects', buildings3D)`).
  - Skip adding `sky` layer (use `setConfigProperty('basemap', 'lightPreset', …)` synced with sun altitude).
- Re-create marker and re-run `computeSiteData` after style switch if a site is already selected.
- Recolor contour lines/labels via `setPaintProperty` based on current style brightness (white halo + warm line on light, amber line + dark halo on dark/satellite).

### 4. Mobile-first UI rebuild

- New layout:
  - On `<lg`: full-bleed map fills `100dvh - header`, search bar floats at top (glassmorphic, 16px font to prevent iOS zoom), style switcher collapses into a single icon-dropdown next to Mapbox's nav controls, layer toggles + site details live in a `MobileMapSheet`-style bottom drawer with snap points (peek / half / full).
  - On `lg+`: existing two-column layout, but map upgraded to `h-[calc(100dvh-9rem)]` and side panel scroll-isolated.
- Style switcher: compact `Popover` with grid of style cards (icon + label), keyboard-navigable, current style highlighted.
- Layer toggles: same `Switch` UX, grouped under "Layers" in the sheet/panel with section header.
- Search: support `lat,lng` parsing, Enter-to-search-first-result, recent-searches list in `localStorage`, clear button.
- Honor reduced-motion (skip `flyTo` animation, use `jumpTo`).
- Honor safe-area insets (`pb-[env(safe-area-inset-bottom)]` on sheet).

### 5. QA verification

After implementation, manually verify on the preview at desktop and 390×844 mobile viewport:
- Each of the 5 styles renders crisply with terrain enabled.
- Toggling each layer (3D Terrain, Hillshade, Contours, 3D Buildings) updates the map without warnings in console.
- Searching an address flies to it, drops a marker, populates Terrain/Location/Sun tabs with real values.
- Clicking the map drops a new pin and refreshes all panels.
- Switching styles preserves the selected pin and re-applies all enabled layers.
- Sun sync changes lighting on Standard style.
- No iOS zoom on input focus; bottom sheet drags smoothly.

## Files to change

- `src/pages/SiteSurvey.tsx` — major rework (split internal helpers for readability; if file exceeds ~600 lines, extract `useSiteSurveyMap` hook and `SiteSurveySheet` component into `src/components/site-survey/`).
- Possibly add: `src/components/site-survey/SiteSurveySheet.tsx`, `src/components/site-survey/StyleSwitcher.tsx`, `src/hooks/useSiteSurveyMap.ts`.

No backend, route, or schema changes.

## Technical notes

- Mapbox Standard config API: `map.setConfigProperty('basemap', '<key>', value)` for `lightPreset`, `show3dObjects`, `showPlaceLabels`, `showRoadLabels`.
- DEM source `mapbox.mapbox-terrain-dem-v1` covers global at z14 — good enough for slope/aspect at z17.
- `queryTerrainElevation` returns `null` until DEM raster for that tile is decoded; polling loop is the documented workaround.
- For high-DPI raster output, `pixelRatio` must be set at map construction (cannot change later) — devicePixelRatio capped at 2 to avoid GPU strain.
