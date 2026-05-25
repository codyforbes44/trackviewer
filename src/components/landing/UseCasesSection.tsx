import { useState } from "react";
import { Truck, Users, Briefcase, Code, Check, HardHat, Home } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const cases = [
  {
    id: "fleet",
    label: "Fleet Management",
    icon: Truck,
    heading: "Optimize Your Fleet in Real-Time",
    description:
      "Monitor every vehicle's location, reduce idle time, and improve delivery efficiency with live GPS tracking links.",
    benefits: [
      "Real-time vehicle position tracking",
      "Route history and playback",
      "No hardware installation required",
    ],
  },
  {
    id: "family",
    label: "Family Safety",
    icon: Users,
    heading: "Keep Your Family Safe",
    description:
      "Share a simple link with family members so you always know they arrived safely — with full privacy control.",
    benefits: [
      "One-tap location sharing",
      "No app downloads for family",
      "Pause sharing anytime",
    ],
  },
  {
    id: "field",
    label: "Field Teams",
    icon: Briefcase,
    heading: "Coordinate Field Teams",
    description:
      "Dispatch and track field workers, delivery agents, and service technicians from a single dashboard.",
    benefits: [
      "Multi-tracker dashboard view",
      "Live status per team member",
      "Works on any device",
    ],
  },
  {
    id: "construction",
    label: "Construction",
    icon: HardHat,
    heading: "Scope Job Sites Before You Roll a Truck",
    description:
      "Drop into any address with 3D terrain, slope and aspect — assess grading, drainage and sun exposure from the office before mobilizing crews.",
    benefits: [
      "Slope, aspect and elevation readouts",
      "Contour lines and hillshade overlays",
      "Sun path & shadow analysis",
    ],
  },
  {
    id: "realestate",
    label: "Real Estate",
    icon: Home,
    heading: "Sell the Land, Not Just the Lot",
    description:
      "Show buyers a 3D view of any parcel — orientation, terrain, sunlight and surrounding context, with no specialty software.",
    benefits: [
      "Address search with autocomplete",
      "Satellite, terrain and street styles",
      "Shareable, mobile-friendly views",
    ],
  },
  {
    id: "devs",
    label: "Developers",
    icon: Code,
    heading: "Built for Developer Workflows",
    description:
      "Integrate location tracking into your own applications with our simple link-based approach — no complex SDKs.",
    benefits: [
      "Simple URL-based integration",
      "Real-time location webhooks",
      "Open browser Geolocation API",
    ],
  },
];

const UseCasesSection = () => {
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  const c = cases[active];

  return (
    <section
      ref={ref}
      className={`py-20 sm:py-24 bg-muted/30 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      aria-labelledby="use-cases-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="use-cases-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10"
        >
          Built for Every Use Case
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto max-w-full">
            {cases.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  active === i
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <c.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <c.icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {c.heading}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {c.description}
          </p>
          <ul className="inline-flex flex-col items-start gap-2 text-sm">
            {c.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-foreground">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
