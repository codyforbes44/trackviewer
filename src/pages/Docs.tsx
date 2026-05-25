import { useState } from "react";
import { BookOpen, Link2, Map, Shield, Zap, Mountain } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

const sections = [
  {
    id: "getting-started",
    icon: Zap,
    title: "Getting Started",
    content: `
      <h3>Welcome to MᴀᴘMᴇ.Lɪᴠᴇ</h3>
      <p>MᴀᴘMᴇ.Lɪᴠᴇ is a dual-purpose mapping platform: <strong>real-time GPS tracking links</strong> for any device, plus a <strong>3D Site Survey</strong> that turns any address into a topographic intelligence panel.</p>
      <h4>Quick Start — Tracking</h4>
      <ol>
        <li><strong>Sign up</strong> — Create a free account at <code>/auth</code>.</li>
        <li><strong>Create a tracker</strong> — From the dashboard, click <em>New Tracker</em> and give it a name.</li>
        <li><strong>Share the link</strong> — Copy the tracking URL or QR code and send it to the device you want to track.</li>
        <li><strong>Monitor in real time</strong> — Open the map view to see live GPS updates.</li>
      </ol>
      <h4>Quick Start — Site Survey</h4>
      <ol>
        <li>From the dashboard, click <strong>Site Survey</strong> (or go to <code>/site-survey</code>).</li>
        <li>Type any address — autocomplete finds it instantly. Or click anywhere on the map.</li>
        <li>Read elevation, slope, aspect, sun position and live weather in the right panel.</li>
      </ol>
    `,
  },
  {
    id: "creating-trackers",
    icon: Link2,
    title: "Creating a Tracker",
    content: `
      <h3>Creating & Managing Trackers</h3>
      <p>Each tracker generates a unique, shareable URL. When someone opens that link on their device, their browser shares location data back to your dashboard.</p>
      <h4>Tracker Options</h4>
      <ul>
        <li><strong>Name:</strong> A friendly label for your tracker (e.g., "Delivery Van #3").</li>
        <li><strong>Password Protection:</strong> Optionally require a password before location sharing begins.</li>
        <li><strong>Active/Inactive:</strong> Toggle tracking on or off at any time from the dashboard.</li>
      </ul>
      <h4>Limits</h4>
      <p>Free accounts can have up to 5 active trackers with 7-day history. Pro unlocks unlimited trackers, 90-day history, geofence alerts and CSV/JSON exports.</p>
    `,
  },
  {
    id: "map-dashboard",
    icon: Map,
    title: "Map Dashboard",
    content: `
      <h3>Using the Map Dashboard</h3>
      <p>The map dashboard provides a real-time view of all your active trackers on an interactive Mapbox-powered map.</p>
      <h4>Features</h4>
      <ul>
        <li><strong>Live updates:</strong> Positions refresh automatically as new data arrives.</li>
        <li><strong>Location history:</strong> View the path a tracker has taken over time with the timeline playback feature.</li>
        <li><strong>Map styles:</strong> Switch between street, satellite, terrain, light and dark themes.</li>
        <li><strong>Search:</strong> Jump to any address or coordinate on the map.</li>
        <li><strong>3D terrain:</strong> Toggle DEM-based terrain exaggeration for context.</li>
        <li><strong>Heatmap:</strong> Visualize density across long histories.</li>
      </ul>
    `,
  },
  {
    id: "site-survey",
    icon: Mountain,
    title: "3D Site Survey",
    content: `
      <h3>3D Site Survey</h3>
      <p>Site Survey is an authenticated tool at <code>/site-survey</code> that turns any address into a best-in-class topographic map. Search an address or click the map to inspect a site.</p>
      <h4>Basemaps</h4>
      <ul>
        <li><strong>Satellite</strong> — high-resolution imagery with street labels</li>
        <li><strong>Terrain</strong> — Mapbox Outdoors with shaded relief</li>
        <li><strong>Streets / Light / Dark</strong> — classic vector themes</li>
      </ul>
      <h4>Layers (toggle in the right panel)</h4>
      <ul>
        <li><strong>3D Terrain</strong> — DEM exaggeration at 1.4×, pitches the map to reveal real elevation</li>
        <li><strong>Hillshade</strong> — soft shaded relief from the DEM</li>
        <li><strong>Contour Lines</strong> — vector contours with labels every 100 m</li>
        <li><strong>3D Buildings</strong> — extruded footprints at zoom ≥ 14</li>
      </ul>
      <h4>Site Details Tabs</h4>
      <ul>
        <li><strong>Terrain</strong> — elevation (m / ft), slope (° and %), aspect (° and compass), current temperature and wind</li>
        <li><strong>Location</strong> — full address, decimal & DMS coordinates, UTM zone, region, country, postal code, copy buttons</li>
        <li><strong>Sun</strong> — live altitude / azimuth, sunrise, solar noon, sunset, and day length, computed locally with NOAA-style equations</li>
      </ul>
      <h4>How it works</h4>
      <p>The map uses Mapbox GL with <code>mapbox-terrain-dem-v1</code> for elevation and <code>mapbox-terrain-v2</code> for contours. Slope and aspect are sampled from four neighbors around the pin (~33 m spacing). Weather is fetched from the public Open-Meteo API.</p>
    `,
  },
  {
    id: "sharing",
    icon: BookOpen,
    title: "Sharing Links",
    content: `
      <h3>Sharing Tracking Links</h3>
      <p>Every tracker has a unique URL in the format <code>mapme.live/track/[id]</code>. Share this link via:</p>
      <ul>
        <li>Text message or WhatsApp</li>
        <li>Email</li>
        <li>QR code (generated automatically in the dashboard)</li>
        <li>Embed in your own application via the API</li>
      </ul>
      <p>When the recipient opens the link, their browser will request permission to share their location. All location data is transmitted securely over HTTPS.</p>
    `,
  },
  {
    id: "privacy-security",
    icon: Shield,
    title: "Privacy & Security",
    content: `
      <h3>Privacy & Security</h3>
      <p>We take data security seriously. Here's how we protect your information:</p>
      <ul>
        <li><strong>Encryption:</strong> All data is encrypted in transit (TLS) and at rest.</li>
        <li><strong>No third-party sharing:</strong> We never sell or share location data with advertisers or data brokers.</li>
        <li><strong>User control:</strong> Tracker owners can deactivate trackers instantly. Users sharing their location can revoke access by simply closing the browser tab.</li>
        <li><strong>Data retention:</strong> Free accounts retain 7 days of history. Pro retains 90 days. You can delete data at any time.</li>
        <li><strong>Row-Level Security:</strong> Our Supabase backend uses RLS policies so users can only access their own data.</li>
        <li><strong>Site Survey privacy:</strong> Site Survey is an authenticated tool; the addresses you inspect are never logged or shared.</li>
      </ul>
    `,
  },
];

const Docs = () => {
  const [active, setActive] = useState("getting-started");

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "Documentation", item: "https://mapme.live/docs" },
    ],
  };

  const current = sections.find((s) => s.id === active)!;

  return (
    <Layout showFooter>
      <SEO
        title="Documentation — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Complete guide to using MᴀᴘMᴇ.Lɪᴠᴇ — creating trackers, sharing links, using the map dashboard, and keeping your data secure."
        canonical="https://mapme.live/docs"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Documentation</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-56 shrink-0 space-y-1" aria-label="Documentation navigation">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "w-full flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors text-left",
                  active === s.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                {s.title}
              </button>
            ))}
          </nav>

          {/* Content */}
          <article
            className="flex-1 prose-custom text-foreground/90 min-w-0
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-3
              [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-6 [&_h4]:mb-2
              [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:text-muted-foreground [&_ol]:mb-3
              [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-foreground
              [&_li_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: current.content }}
          />
        </div>
      </main>
    </Layout>
  );
};

export default Docs;
