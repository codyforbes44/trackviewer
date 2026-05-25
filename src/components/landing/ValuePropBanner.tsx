import { Globe, Lock, Zap, Mountain } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const props = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Generate a tracking link or open a site in seconds. No app installs, no sign-up required for viewers.",
  },
  {
    icon: Mountain,
    title: "Terrain Intelligence",
    description: "Elevation, slope, aspect, contour lines, hillshade and live sun path for any address on the planet.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Any device with a browser can share, view or survey a location. Cross-platform by default.",
  },
  {
    icon: Lock,
    title: "Privacy-First",
    description: "Tracking only happens with explicit consent. You own the data, control sharing, and can delete instantly.",
  },
];

const ValuePropBanner = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="value-prop"
      ref={ref}
      className={`py-16 sm:py-20 border-y border-border/50 bg-muted/30 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-foreground mb-10">
          Why MapMe.Live?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {props.map((p, i) => (
            <div
              key={p.title}
              className={`text-center space-y-3 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropBanner;
