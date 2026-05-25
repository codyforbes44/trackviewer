import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: object;
  noindex?: boolean;
}

const SEO = ({
  title = "MᴀᴘMᴇ.Lɪᴠᴇ — Real-Time GPS Tracking & 3D Site Survey",
  description = "Real-time GPS tracking links plus a best-in-class 3D site survey: terrain, elevation, slope, contour lines, sun path, and live weather for any address.",
  keywords = "GPS tracking, real-time location tracking, tracking link, site survey, terrain map, elevation map, contour lines, slope analysis, sun path, hillshade, 3D map, Mapbox",
  canonical = "https://mapme.live",
  ogType = "website",
  ogImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/iC4WGuGth9hul7BjQ42FtWwEb9C3/social-images/social-1773081056490-01a7b120-9dbd-4aa4-9a7f-1ff045a47dbf.webp",
  structuredData,
  noindex = false,
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      <meta name="author" content="MᴀᴘMᴇ.Lɪᴠᴇ" />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="MᴀᴘMᴇ.Lɪᴠᴇ - Real-Time Location Tracking Platform" />
      <meta property="og:site_name" content="MᴀᴘMᴇ.Lɪᴠᴇ" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="MᴀᴘMᴇ.Lɪᴠᴇ Location Tracking Platform" />

      {/* PWA & Mobile */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MapMe.Live" />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://api.mapbox.com" />
      <link rel="dns-prefetch" href="https://api.mapbox.com" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
