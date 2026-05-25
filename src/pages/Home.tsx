import SEO from "@/components/SEO";
import Layout from "@/components/Layout";
import HeroSection from "@/components/landing/HeroSection";
import ValuePropBanner from "@/components/landing/ValuePropBanner";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "MᴀᴘMᴇ.Lɪᴠᴇ",
      url: "https://mapme.live",
      logo: "https://mapme.live/og-image.png",
      description: "Real-time GPS tracking and 3D site survey platform",
    },
    {
      "@type": "WebSite",
      name: "MᴀᴘMᴇ.Lɪᴠᴇ",
      url: "https://mapme.live",
    },
    {
      "@type": "WebApplication",
      name: "MᴀᴘMᴇ.Lɪᴠᴇ",
      url: "https://mapme.live/",
      applicationCategory: ["UtilityApplication", "MapApplication"],
      operatingSystem: "Web Browser",
      featureList: [
        "Real-time GPS tracking links",
        "Shareable tracking dashboards",
        "3D terrain & elevation",
        "Contour lines & hillshade",
        "Slope and aspect analysis",
        "Sun path & live weather",
        "Satellite, terrain and street basemaps",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does MᴀᴘMᴇ.Lɪᴠᴇ work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MᴀᴘMᴇ.Lɪᴠᴇ generates shareable GPS tracking links and includes a 3D Site Survey that turns any address into a topographic map with elevation, slope, contour lines, sun path and live weather.",
          },
        },
        {
          "@type": "Question",
          name: "What is the 3D Site Survey?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A built-in tool that lets authenticated users search any address and inspect 3D terrain, elevation, slope, aspect, contour lines, hillshade, 3D buildings, sun position and live weather.",
          },
        },
        {
          "@type": "Question",
          name: "Is MᴀᴘMᴇ.Lɪᴠᴇ free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Free plan includes up to 5 trackers and full access to Site Survey at no cost. Pro adds unlimited trackers, longer history, geofence alerts and API access.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live" },
      ],
    },
  ],
};

const Home = () => {
  return (
    <>
      <SEO
        title="MᴀᴘMᴇ.Lɪᴠᴇ — Real-Time GPS Tracking & 3D Site Survey"
        description="Real-time GPS tracking links plus a 3D site survey for any address: terrain, elevation, slope, contour lines, sun path and live weather. Free for personal use."
        keywords="GPS tracking, real-time location tracking, tracking link, site survey, terrain map, elevation, contour lines, slope analysis, sun path, hillshade, 3D map"
        canonical="https://mapme.live/"
        structuredData={structuredData}
      />
      <Layout showFooter={false}>
        <main>
          <HeroSection />
          <ValuePropBanner />
          <FeaturesSection />
          <UseCasesSection />
          <HowItWorksSection />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Home;
