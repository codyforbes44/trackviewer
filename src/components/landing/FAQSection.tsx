import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqItems = [
  {
    question: "How does MᴀᴘMᴇ.Lɪᴠᴇ work?",
    answer:
      "MᴀᴘMᴇ.Lɪᴠᴇ does two things. Tracking: generate a unique link, share it with any device, and watch live GPS on your dashboard. Site Survey: type any address and instantly see 3D terrain, elevation, slope, contour lines, sun path and live weather.",
  },
  {
    question: "What is the 3D Site Survey?",
    answer:
      "It's an authenticated tool on the dashboard that turns any address into a best-in-class topographic map. You get 5 base styles (satellite, terrain, streets, light, dark), 3D terrain with hillshade and contour lines, 3D buildings, elevation, slope, compass aspect, UTM coordinates, live sun position (altitude/azimuth, sunrise, solar noon, sunset, day length) and current weather.",
  },
  {
    question: "Do I need an app for either feature?",
    answer:
      "No. Recipients of a tracking link just open it in their browser — the standard Geolocation API handles the rest. Site Survey runs entirely in your browser too, using Mapbox GL for hardware-accelerated 3D rendering.",
  },
  {
    question: "Is MᴀᴘMᴇ.Lɪᴠᴇ free to use?",
    answer:
      "Yes. The Free plan lets you create up to 5 trackers and use Site Survey at no cost. Pro unlocks unlimited trackers, longer history, geofence alerts, API access and CSV/JSON exports.",
  },
  {
    question: "Is my location data secure?",
    answer:
      "Absolutely. All data is encrypted in transit and at rest. Only authenticated tracker owners can view location data. You can pause or delete trackers at any time.",
  },
  {
    question: "What devices are supported?",
    answer:
      "Any device with a modern web browser and GPS capability — smartphones, tablets, and laptops on iOS, Android, Windows, macOS, and Linux.",
  },
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`py-20 sm:py-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="faq-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-3xl mx-auto"
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
