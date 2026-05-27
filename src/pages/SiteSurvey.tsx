import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, Loader2, MapPin, Mountain, Compass, Sun, Ruler, Layers, Crosshair, Building2, Cloud, AlertCircle, Copy, X, ChevronUp, ChevronDown } from 'lucide-react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string }>;
}

interface SiteInfo {
  address: string;
  lng: number;
  lat: number;
  elevation: number | null;
  slope: number | null;
  aspect: number | null;
  aspectLabel: string;
  utm: string;
  country?: string;
  region?: string;
  postcode?: string;
}

const MAP_STYLES = [
  { id: 'standard-satellite', label: 'Satellite', icon: '🛰️', url: 'mapbox://styles/mapbox/standard-satellite', standard: true },
  { id: 'standard', label: 'Standard', icon: '🏙️', url: 'mapbox://styles/mapbox/standard', standard: true },
  { id: 'outdoors-v12', label: 'Topo', icon: '⛰️', url: 'mapbox://styles/mapbox/outdoors-v12', standard: false },
  { id: 'streets-v12', label: 'Streets', icon: '🗺️', url: 'mapbox://styles/mapbox/streets-v12', standard: false },
  { id: 'dark-v11', label: 'Dark', icon: '🌙', url: 'mapbox://styles/mapbox/dark-v11', standard: false },
] as const;

type StyleId = typeof MAP_STYLES[number]['id'];
const styleMeta = (id: StyleId) => MAP_STYLES.find((s) => s.id === id)!;

// ── Solar position (NOAA simplified) ──
function solarPosition(date: Date, lat: number, lng: number) {
  const rad = Math.PI / 180;
  const dayMs = 1000 * 60 * 60 * 24;
  const J1970 = 2440588;
  const J2000 = 2451545;
  const toJulian = (d: Date) => d.valueOf() / dayMs - 0.5 + J1970;
  const toDays = (d: Date) => toJulian(d) - J2000;
  const e = rad * 23.4397;
  const d = toDays(date);
  const M = rad * (357.5291 + 0.98560028 * d);
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = rad * 102.9372;
  const L = M + C + P + Math.PI;
  const dec = Math.asin(Math.sin(0) * Math.cos(e) + Math.cos(0) * Math.sin(e) * Math.sin(L));
  const ra = Math.atan2(Math.sin(L) * Math.cos(e) - Math.tan(0) * Math.sin(e), Math.cos(L));
  const lw = rad * -lng;
  const phi = rad * lat;
  const H = rad * (280.16 + 360.9856235 * d) - lw - ra;
  const altitude = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const azimuth = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
  return {
    altitude: altitude / rad,
    azimuth: ((azimuth / rad + 180) % 360 + 360) % 360,
  };
}

function sunTimes(date: Date, lat: number, lng: number) {
  const rad = Math.PI / 180;
  const J1970 = 2440588;
  const J2000 = 2451545;
  const dayMs = 86400000;
  const J0 = 0.0009;
  const toJulian = (d: Date) => d.valueOf() / dayMs - 0.5 + J1970;
  const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * dayMs);
  const julianCycle = (d: number, lw: number) => Math.round(d - J0 - lw / (2 * Math.PI));
  const approxTransit = (Ht: number, lw: number, n: number) => J0 + (Ht + lw) / (2 * Math.PI) + n;
  const solarMeanAnomaly = (d: number) => rad * (357.5291 + 0.98560028 * d);
  const eclipticLongitude = (M: number) => {
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const P = rad * 102.9372;
    return M + C + P + Math.PI;
  };
  const declination = (L: number) => Math.asin(Math.sin(0) * Math.cos(rad * 23.4397) + Math.cos(0) * Math.sin(rad * 23.4397) * Math.sin(L));
  const hourAngle = (h: number, phi: number, d: number) =>
    Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)));
  const solarTransitJ = (ds: number, M: number, L: number) =>
    J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const getSetJ = (h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number) => {
    const w = hourAngle(h, phi, dec);
    const a = approxTransit(w, lw, n);
    return solarTransitJ(a, M, L);
  };
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toJulian(date) - J2000;
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L);
  const Jnoon = solarTransitJ(ds, M, L);
  const Jset = getSetJ(rad * -0.833, lw, phi, dec, n, M, L);
  const Jrise = Jnoon - (Jset - Jnoon);
  return { sunrise: fromJulian(Jrise), sunset: fromJulian(Jset), solarNoon: fromJulian(Jnoon) };
}

function toDMS(deg: number, isLat: boolean) {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = ((abs - d) * 60 - m) * 60;
  const hem = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return `${d}°${String(m).padStart(2, '0')}'${s.toFixed(1)}" ${hem}`;
}

function toUTM(lat: number, lng: number) {
  const zone = Math.floor((lng + 180) / 6) + 1;
  const band = 'CDEFGHJKLMNPQRSTUVWX'[Math.floor((lat + 80) / 8)] || '';
  return `${zone}${band}`;
}

function aspectToCompass(deg: number) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(((deg % 360) / 45)) % 8];
}

const SiteSurvey = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [styleId, setStyleId] = useState<StyleId>('standard-satellite');
  const [terrain3D, setTerrain3D] = useState(true);
  const [contours, setContours] = useState(true);
  const [hillshade, setHillshade] = useState(true);
  const [buildings3D, setBuildings3D] = useState(true);
  const [sampling, setSampling] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const isMobile = useIsMobile();
  const lastSiteRef = useRef<{ lng: number; lat: number; place: Suggestion | null } | null>(null);

  const [info, setInfo] = useState<SiteInfo | null>(null);
  const [weather, setWeather] = useState<{ temp: number; wind: number; code: number } | null>(null);
  const [now, setNow] = useState(new Date());

  // Fetch token
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        if (data?.token) setMapboxToken(data.token);
        else throw new Error('No token returned');
      } catch (e: any) {
        setTokenError(e.message || 'Failed to load map token');
      }
    })();
  }, []);

  // Tick for sun position
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Apply terrain/layers when toggles or style change
  const applyLayers = useCallback(() => {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) return;
    const meta = styleMeta(styleId);
    const isStandard = meta.standard;

    // DEM source
    if (!m.getSource('mapbox-dem')) {
      m.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
    }
    m.setTerrain(terrain3D ? { source: 'mapbox-dem', exaggeration: 1.4 } : null);

    // Hillshade
    if (hillshade) {
      if (!m.getLayer('hillshading')) {
        try {
          const layerSpec: any = {
            id: 'hillshading',
            source: 'mapbox-dem',
            type: 'hillshade',
            paint: { 'hillshade-exaggeration': 0.6 },
          };
          if (isStandard) layerSpec.slot = 'middle';
          m.addLayer(layerSpec);
        } catch { /* noop */ }
      }
    } else if (m.getLayer('hillshading')) {
      m.removeLayer('hillshading');
    }

    // Contours
    const darkBase = isStandard ? styleId === 'standard-satellite' : (styleId === 'dark-v11');
    const contourLine = darkBase ? '#ffd27a' : '#7a3a18';
    const contourHalo = darkBase ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
    const contourText = darkBase ? '#fff4d6' : '#3a1a08';
    if (contours) {
      if (!m.getSource('contours')) {
        m.addSource('contours', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-terrain-v2',
        });
      }
      if (!m.getLayer('contour-lines')) {
        try {
          const spec: any = {
            id: 'contour-lines',
            type: 'line',
            source: 'contours',
            'source-layer': 'contour',
            paint: {
              'line-color': contourLine,
              'line-width': ['case', ['==', ['%', ['get', 'ele'], 100], 0], 1.3, 0.6],
              'line-opacity': 0.8,
            },
          };
          if (isStandard) spec.slot = 'middle';
          m.addLayer(spec);
        } catch { /* noop */ }
      } else {
        m.setPaintProperty('contour-lines', 'line-color', contourLine);
      }
      if (!m.getLayer('contour-labels')) {
        try {
          const spec: any = {
            id: 'contour-labels',
            type: 'symbol',
            source: 'contours',
            'source-layer': 'contour',
            filter: ['==', ['%', ['get', 'ele'], 100], 0],
            layout: {
              'symbol-placement': 'line',
              'text-field': ['concat', ['to-string', ['get', 'ele']], ' m'],
              'text-font': isStandard
                ? ['Open Sans Semibold', 'Arial Unicode MS Regular']
                : ['DIN Pro Medium', 'Arial Unicode MS Regular'],
              'text-size': 11,
            },
            paint: {
              'text-color': contourText,
              'text-halo-color': contourHalo,
              'text-halo-width': 1.2,
            },
          };
          if (isStandard) spec.slot = 'top';
          m.addLayer(spec);
        } catch { /* noop */ }
      } else {
        m.setPaintProperty('contour-labels', 'text-color', contourText);
        m.setPaintProperty('contour-labels', 'text-halo-color', contourHalo);
      }
    } else {
      ['contour-labels', 'contour-lines'].forEach((l) => m.getLayer(l) && m.removeLayer(l));
    }

    // 3D buildings
    if (isStandard) {
      // Standard styles ship with 3D objects; toggle via config.
      try { (m as any).setConfigProperty('basemap', 'show3dObjects', buildings3D); } catch { /* noop */ }
      if (m.getLayer('3d-buildings')) m.removeLayer('3d-buildings');
    } else {
      const labelLayer = m.getStyle().layers?.find((l: any) => l.type === 'symbol' && l.layout?.['text-field'])?.id;
      if (buildings3D) {
        if (!m.getLayer('3d-buildings')) {
          try {
            m.addLayer({
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.05, ['get', 'height']],
                'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 14, 0, 15.05, ['get', 'min_height']],
                'fill-extrusion-opacity': 0.78,
              },
            }, labelLayer);
          } catch { /* noop */ }
        }
      } else if (m.getLayer('3d-buildings')) {
        m.removeLayer('3d-buildings');
      }

      // Sky (classic styles only — Standard provides its own atmosphere)
      if (!m.getLayer('sky')) {
        try {
          m.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0, 0],
              'sky-atmosphere-sun-intensity': 15,
            },
          });
        } catch { /* noop */ }
      }
    }
  }, [styleId, terrain3D, hillshade, contours, buildings3D]);

  // Init map
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = mapboxToken;
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleMeta(styleId).url,
      center: [-98.5795, 39.8283],
      zoom: 3.5,
      pitch: 50,
      bearing: 0,
      antialias: true,
      maxZoom: 22,
      projection: 'globe' as any,
      respectPrefersReducedMotion: true,
      attributionControl: false,
    } as any);
    m.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
    m.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    m.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    m.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    m.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right');
    m.on('style.load', () => {
      applyLayers();
      // Restore marker + recompute after style swap
      const last = lastSiteRef.current;
      if (last) {
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new mapboxgl.Marker({ color: '#e85d3a' }).setLngLat([last.lng, last.lat]).addTo(m);
      }
    });
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, [mapboxToken]); // eslint-disable-line

  // Re-apply on toggle changes
  useEffect(() => { applyLayers(); }, [applyLayers]);

  // Style change
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(styleMeta(styleId).url, { diff: true } as any);
  }, [styleId]);

  // Geocoding search (debounced)
  useEffect(() => {
    if (!mapboxToken || !query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&autocomplete=true&limit=5`
        );
        const json = await res.json();
        setSuggestions(json.features || []);
      } finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query, mapboxToken]);

  const computeSiteData = useCallback(async (lng: number, lat: number, place: Suggestion | null) => {
    const m = map.current;
    if (!m) return;
    lastSiteRef.current = { lng, lat, place };
    setSampling(true);

    // Poll terrain queries until DEM tiles are decoded (≤ 2s).
    const queryEl = (x: number, y: number) => {
      try { return m.queryTerrainElevation([x, y], { exaggerated: false }); } catch { return null; }
    };
    const dLat = 0.0003;
    const dLng = 0.0003 / Math.cos(lat * Math.PI / 180);
    const sample = () => {
      const elev = queryEl(lng, lat);
      const n = queryEl(lng, lat + dLat);
      const s = queryEl(lng, lat - dLat);
      const e = queryEl(lng + dLng, lat);
      const w = queryEl(lng - dLng, lat);
      return { elev, n, s, e, w };
    };
    let r = sample();
    const start = Date.now();
    while ((r.elev == null || r.n == null || r.s == null || r.e == null || r.w == null) && Date.now() - start < 2000) {
      await new Promise((res) => setTimeout(res, 120));
      r = sample();
    }
    const elevation = r.elev;
    let slope: number | null = null;
    let aspect: number | null = null;
    if (r.n != null && r.s != null && r.e != null && r.w != null) {
      // ~33m per 0.0003° latitude
      const dzdx = (r.e - r.w) / (2 * 33);
      const dzdy = (r.n - r.s) / (2 * 33);
      slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy)) * (180 / Math.PI);
      // Aspect = compass bearing of downhill direction (0°=N, clockwise).
      aspect = (Math.atan2(-dzdx, -dzdy) * 180 / Math.PI + 360) % 360;
    }

    // Reverse geocode if no place provided
    let address = place?.place_name || '';
    let country = '', region = '', postcode = '';
    const ctx = place?.context || [];
    ctx.forEach((c) => {
      if (c.id.startsWith('country')) country = c.text;
      if (c.id.startsWith('region')) region = c.text;
      if (c.id.startsWith('postcode')) postcode = c.text;
    });
    if (!address) {
      try {
        const r = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&limit=1`);
        const j = await r.json();
        address = j.features?.[0]?.place_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        j.features?.[0]?.context?.forEach((c: any) => {
          if (c.id.startsWith('country')) country = c.text;
          if (c.id.startsWith('region')) region = c.text;
          if (c.id.startsWith('postcode')) postcode = c.text;
        });
      } catch { address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`; }
    }

    setInfo({
      address, lng, lat,
      elevation,
      slope,
      aspect,
      aspectLabel: aspect != null ? aspectToCompass(aspect) : '—',
      utm: toUTM(lat, lng),
      country, region, postcode,
    });
    setSampling(false);
    if (elevation == null) {
      toast({ title: 'Terrain unavailable', description: 'No DEM coverage at this location or zoom out further.', variant: 'destructive' });
    }

    // Weather (Open-Meteo, free, no key)
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,weather_code`);
      const j = await r.json();
      if (j.current) setWeather({ temp: j.current.temperature_2m, wind: j.current.wind_speed_10m, code: j.current.weather_code });
    } catch { setWeather(null); }
  }, [mapboxToken]);

  const flyToLocation = useCallback((lng: number, lat: number, place: Suggestion | null) => {
    const m = map.current;
    if (!m) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      m.jumpTo({ center: [lng, lat], zoom: 17, pitch: 60, bearing: -20 });
    } else {
      m.flyTo({ center: [lng, lat], zoom: 17, pitch: 60, bearing: -20, speed: 1.2, essential: true });
    }
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new mapboxgl.Marker({ color: '#e85d3a' }).setLngLat([lng, lat]).addTo(m);

    const onIdle = () => {
      computeSiteData(lng, lat, place);
      m.off('idle', onIdle);
    };
    m.on('idle', onIdle);
    setSheetExpanded(true);
  }, [computeSiteData]);

  // Click on map = drop pin
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;
    const handler = (ev: mapboxgl.MapMouseEvent) => {
      flyToLocation(ev.lngLat.lng, ev.lngLat.lat, null);
    };
    m.on('click', handler);
    return () => { m.off('click', handler); };
  }, [flyToLocation, mapboxToken]);

  const sun = useMemo(() => {
    if (!info) return null;
    const pos = solarPosition(now, info.lat, info.lng);
    const times = sunTimes(now, info.lat, info.lng);
    return { ...pos, ...times };
  }, [info, now]);

  // Sync sky/sun
  useEffect(() => {
    if (!map.current || !sun) return;
    const meta = styleMeta(styleId);
    if (meta.standard) {
      const preset = sun.altitude > 10 ? 'day' : sun.altitude > -6 ? 'dusk' : 'night';
      try { (map.current as any).setConfigProperty('basemap', 'lightPreset', preset); } catch { /* noop */ }
    } else if (map.current.getLayer('sky')) {
      try { map.current.setPaintProperty('sky', 'sky-atmosphere-sun', [sun.azimuth, Math.max(0, 90 - sun.altitude)]); } catch { /* noop */ }
    }
  }, [sun, styleId]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: `${label} copied to clipboard.` });
  };

  // Parse "lat,lng" / "lat lng" / "lat, lng" input
  const parseLatLng = (raw: string): [number, number] | null => {
    const m = raw.trim().match(/^(-?\d{1,3}(?:\.\d+)?)[\s,]+(-?\d{1,3}(?:\.\d+)?)$/);
    if (!m) return null;
    const lat = parseFloat(m[1]); const lng = parseFloat(m[2]);
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return [lat, lng];
  };

  const submitSearch = () => {
    const ll = parseLatLng(query);
    if (ll) {
      flyToLocation(ll[1], ll[0], null);
      setShowSuggestions(false);
      return;
    }
    const first = suggestions[0];
    if (first) {
      setQuery(first.place_name);
      setShowSuggestions(false);
      flyToLocation(first.center[0], first.center[1], first);
    }
  };

  const LayerToggles = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="t-3d" className="flex items-center gap-2 cursor-pointer text-sm"><Mountain className="w-4 h-4" /> 3D Terrain</Label>
        <Switch id="t-3d" checked={terrain3D} onCheckedChange={setTerrain3D} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="t-hs" className="flex items-center gap-2 cursor-pointer text-sm"><Mountain className="w-4 h-4" /> Hillshade</Label>
        <Switch id="t-hs" checked={hillshade} onCheckedChange={setHillshade} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="t-ct" className="flex items-center gap-2 cursor-pointer text-sm"><Ruler className="w-4 h-4" /> Contour Lines</Label>
        <Switch id="t-ct" checked={contours} onCheckedChange={setContours} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="t-bd" className="flex items-center gap-2 cursor-pointer text-sm"><Building2 className="w-4 h-4" /> 3D Buildings</Label>
        <Switch id="t-bd" checked={buildings3D} onCheckedChange={setBuildings3D} />
      </div>
    </div>
  );

  const SiteDetails = info ? (
    <Tabs defaultValue="terrain">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="terrain">Terrain</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="sun">Sun</TabsTrigger>
      </TabsList>
      <TabsContent value="terrain" className="space-y-3 mt-4">
        {sampling ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Sampling terrain…
          </div>
        ) : (
          <>
            <Stat label="Elevation" value={info.elevation != null ? `${info.elevation.toFixed(1)} m / ${(info.elevation * 3.28084).toFixed(1)} ft` : '—'} />
            <Stat label="Slope" value={info.slope != null ? `${info.slope.toFixed(1)}° (${(Math.tan(info.slope * Math.PI / 180) * 100).toFixed(1)}%)` : '—'} />
            <Stat label="Aspect" value={info.aspect != null ? `${info.aspect.toFixed(0)}° (${info.aspectLabel})` : '—'} />
          </>
        )}
        {weather && (
          <>
            <Separator />
            <Stat label="Temperature" value={`${weather.temp.toFixed(1)} °C / ${(weather.temp * 9 / 5 + 32).toFixed(1)} °F`} icon={<Cloud className="w-3.5 h-3.5" />} />
            <Stat label="Wind" value={`${weather.wind.toFixed(1)} km/h`} />
          </>
        )}
      </TabsContent>
      <TabsContent value="location" className="space-y-3 mt-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          <p className="text-sm">{info.address}</p>
        </div>
        <Stat label="Latitude" value={`${info.lat.toFixed(6)} (${toDMS(info.lat, true)})`} onCopy={() => copy(info.lat.toString(), 'Latitude')} />
        <Stat label="Longitude" value={`${info.lng.toFixed(6)} (${toDMS(info.lng, false)})`} onCopy={() => copy(info.lng.toString(), 'Longitude')} />
        <Stat label="UTM Zone" value={info.utm} />
        {info.region && <Stat label="Region" value={info.region} />}
        {info.country && <Stat label="Country" value={info.country} />}
        {info.postcode && <Stat label="Postal Code" value={info.postcode} />}
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => copy(`${info.lat},${info.lng}`, 'Coordinates')}>
          <Copy className="w-3.5 h-3.5" /> Copy lat,lng
        </Button>
      </TabsContent>
      <TabsContent value="sun" className="space-y-3 mt-4">
        {sun && (
          <>
            <Stat label="Sun Altitude" value={`${sun.altitude.toFixed(1)}°`} icon={<Sun className="w-3.5 h-3.5" />} />
            <Stat label="Sun Azimuth" value={`${sun.azimuth.toFixed(0)}° (${aspectToCompass(sun.azimuth)})`} icon={<Compass className="w-3.5 h-3.5" />} />
            <Separator />
            <Stat label="Sunrise" value={sun.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            <Stat label="Solar Noon" value={sun.solarNoon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            <Stat label="Sunset" value={sun.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            <Stat label="Day Length" value={formatDuration(sun.sunset.getTime() - sun.sunrise.getTime())} />
          </>
        )}
      </TabsContent>
    </Tabs>
  ) : (
    <div className="p-4 text-center text-sm text-muted-foreground">
      <MapPin className="w-7 h-7 mx-auto mb-2 opacity-50" />
      Search an address or tap the map to inspect a site.
    </div>
  );

  const StylePicker = (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-1.5 rounded-lg shadow-elevated bg-card/90 backdrop-blur-md border border-border/50 text-foreground hover:bg-card h-9">
          <Layers className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">{styleMeta(styleId).label}</span>
          <span className="sm:hidden">{styleMeta(styleId).icon}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {MAP_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-2.5 rounded-lg text-xs transition-all',
                styleId === s.id ? 'bg-primary/15 text-primary ring-1 ring-primary/30 font-medium' : 'hover:bg-muted text-foreground',
              )}
            >
              <span className="text-lg">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      <SEO
        title="Site Survey - Land & Terrain Map | MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Best-in-class site survey: 3D terrain, contour lines, hillshade, elevation, slope, aspect, sun path, and live weather for any address."
        canonical="https://mapme.live/site-survey"
        noindex
      />
      <Layout>
        <main aria-label="Site Survey" className="relative w-full h-[calc(100dvh-4rem)] overflow-hidden">
          {/* Map area */}
          <div className="absolute inset-0">
            {tokenError ? (
              <div className="w-full h-full flex items-center justify-center text-center p-6 bg-muted">
                <div>
                  <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
                  <p className="font-medium">Could not load map</p>
                  <p className="text-sm text-muted-foreground">{tokenError}</p>
                </div>
              </div>
            ) : !mapboxToken ? (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div ref={mapContainer} className="w-full h-full" />
            )}
          </div>

          {/* Floating search + style picker */}
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-[420px] z-20 flex items-start gap-2">
            <div className="flex-1 relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitSearch(); } }}
                  placeholder="Search address or lat,lng…"
                  className="pl-9 pr-9 h-10 bg-card/95 backdrop-blur-md border-border/50 shadow-elevated"
                  style={{ fontSize: '16px' }}
                  aria-label="Search location"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                    className="absolute right-2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Clear"
                  ><X className="w-3.5 h-3.5" /></button>
                )}
                {searching && <Loader2 className="absolute right-8 w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 rounded-lg border border-border/50 bg-popover/95 backdrop-blur-md shadow-elevated overflow-hidden">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setQuery(s.place_name);
                        setShowSuggestions(false);
                        flyToLocation(s.center[0], s.center[1], s);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-accent flex items-start gap-2 border-b border-border/30 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span className="text-sm">{s.place_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {StylePicker}
          </div>

          {/* Heading badge */}
          <div className="hidden md:flex absolute bottom-4 left-4 z-10 items-center gap-2 bg-card/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-card border border-border/50">
            <Crosshair className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium">Site Survey</span>
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">Beta</Badge>
          </div>

          {/* Desktop side panel */}
          {!isMobile && (
            <div
              className="absolute top-0 right-0 z-10 w-[360px] h-full bg-card/95 backdrop-blur-md border-l border-border/50 shadow-elevated overflow-y-auto"
              style={{ paddingTop: '4rem' }}
            >
              <div className="p-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><Layers className="w-4 h-4" /> Layers</CardTitle>
                  </CardHeader>
                  <CardContent>{LayerToggles}</CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><Crosshair className="w-4 h-4" /> Site Details</CardTitle>
                  </CardHeader>
                  <CardContent>{SiteDetails}</CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Mobile bottom sheet */}
          {isMobile && (
            <div
              className={cn(
                'absolute left-0 right-0 bottom-0 z-20 transition-transform duration-300 ease-out',
                sheetExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-4.5rem)]',
              )}
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="bg-card/95 backdrop-blur-md rounded-t-2xl shadow-elevated border-t border-border/50">
                <button
                  onClick={() => setSheetExpanded((v) => !v)}
                  className="w-full flex flex-col items-center pt-2 pb-2 touch-manipulation"
                  aria-label={sheetExpanded ? 'Collapse' : 'Expand'}
                >
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mb-2" />
                  <div className="flex items-center justify-between w-full px-4">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Crosshair className="w-3.5 h-3.5 text-primary" />
                      {info ? (info.address.split(',')[0] || 'Site') : 'Tap map to inspect'}
                    </span>
                    {sheetExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>
                <div className="px-4 pb-4 space-y-4 max-h-[60dvh] overflow-y-auto scrollbar-thin">
                  <div>
                    <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5"><Layers className="w-3 h-3" /> Layers</h3>
                    {LayerToggles}
                  </div>
                  <Separator />
                  {SiteDetails}
                </div>
              </div>
            </div>
          )}
        </main>
      </Layout>
    </>
  );
};

function Stat({ label, value, icon, onCopy }: { label: string; value: string; icon?: React.ReactNode; onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">{icon}{label}</span>
      <button
        type="button"
        onClick={onCopy}
        className={`text-sm font-medium text-right ${onCopy ? 'hover:text-primary cursor-pointer' : 'cursor-default'}`}
      >
        {value}
      </button>
    </div>
  );
}

function formatDuration(ms: number) {
  const mins = Math.round(ms / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default SiteSurvey;