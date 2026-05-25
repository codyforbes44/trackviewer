import { Check, Link2, Map, Shield, Mountain } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import VideoBackground from "@/components/VideoBackground";

const features = [
  {
    icon: Link2,
    title: "Instant Link Generation",
    description:
      "Create a unique tracking URL in one click and share via text, email, or QR code — no recipient setup needed.",
    bullets: [
      "One-click link creation",
      "QR code auto-generation",
      "Custom link naming",
    ],
    mockup: (
      <div className="bg-secondary/60 rounded-xl p-4 border border-border/50 font-mono text-xs sm:text-sm space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">$</span> mapme generate --name
          "delivery-01"
        </div>
        <div className="text-green-400">
          ✓ Link created: mapme.live/t/xK9mQ2
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">$</span> mapme qr xK9mQ2
        </div>
        <div className="text-green-400">✓ QR saved to clipboard</div>
      </div>
    ),
  },
  {
    icon: Map,
    title: "Live Map Dashboard",
    description:
      "Watch GPS coordinates update in real-time on a beautiful interactive map with full location history.",
    bullets: [
      "Real-time GPS updates",
      "Location history timeline",
      "Multiple map styles",
    ],
    mockup: (
      <div className="bg-secondary/60 rounded-xl border border-border/50 overflow-hidden aspect-video relative">
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${(i + 1) * 16.6}%`}
              x2="100%"
              y2={`${(i + 1) * 16.6}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i + 1) * 10}%`}
              y1="0"
              x2={`${(i + 1) * 10}%`}
              y2="100%"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
          ))}
        </svg>
        <div className="absolute top-[40%] left-[55%] w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]">
          <div className="absolute -inset-2 rounded-full bg-primary/30 animate-ping" />
        </div>
        <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm rounded-md px-3 py-1.5 text-[10px] border border-border/50 text-foreground">
          <span className="text-green-400 mr-1">●</span> 3 active trackers
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Privacy & Control",
    description:
      "You own your data. Pause, delete, or password-protect any tracker at any time with full audit controls.",
    bullets: [
      "Pause & resume anytime",
      "Password-protected links",
      "One-click data deletion",
    ],
    mockup: (
      <div className="bg-secondary/60 rounded-xl p-4 border border-border/50 space-y-3">
        {[
          { label: "Location sharing", active: true },
          { label: "Password protection", active: true },
          { label: "Allow history access", active: false },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-foreground">{item.label}</span>
            <div
              className={`w-10 h-5 rounded-full relative transition-colors ${item.active ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${item.active ? "left-[22px]" : "left-0.5"}`}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Mountain,
    title: "3D Site Survey",
    description:
      "Type any address and instantly see 3D terrain, elevation, slope, aspect, contour lines, sun path and live weather — built for planners, builders, and outdoor pros.",
    bullets: [
      "Satellite, terrain, hillshade & contours",
      "Live elevation, slope % and compass aspect",
      "Sun position, sunrise/sunset, day length",
    ],
    mockup: (
      <div className="bg-secondary/60 rounded-xl border border-border/50 overflow-hidden aspect-video relative">
        {/* Terrain gradient + contour lines */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-emerald-800/30 to-emerald-950/50" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120" fill="none">
          {[15, 30, 45, 60, 75, 90, 105].map((y, i) => (
            <path
              key={i}
              d={`M0 ${y} Q 50 ${y - 8 + i} 100 ${y + 4 - i} T 200 ${y + 2}`}
              stroke="hsl(var(--primary))"
              strokeOpacity={0.45}
              strokeWidth="0.6"
              fill="none"
            />
          ))}
        </svg>
        {/* Pin */}
        <div className="absolute top-[42%] left-[58%] w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)] border-2 border-primary-foreground">
          <div className="absolute -inset-2 rounded-full bg-primary/30 animate-ping" />
        </div>
        {/* Readout */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {[
            { k: "Elev", v: "1,284 m" },
            { k: "Slope", v: "8.2°" },
            { k: "Aspect", v: "SW" },
            { k: "Sun", v: "42° az 218°" },
          ].map((s) => (
            <span key={s.k} className="bg-card/85 backdrop-blur-sm rounded-md px-2 py-0.5 text-[10px] border border-border/50 text-foreground">
              <span className="text-muted-foreground mr-1">{s.k}</span>{s.v}
            </span>
          ))}
        </div>
      </div>
    ),
  },
];

const FeatureRow = ({
  feature,
  reversed,
}: {
  feature: (typeof features)[0];
  reversed: boolean;
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className={reversed ? "md:order-2" : ""}>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
          <ul className="space-y-2">
            {feature.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={reversed ? "md:order-1" : ""}>{feature.mockup}</div>
    </div>
  );
};

const FeaturesSection = () => (
  <section
    className="py-20 sm:py-24 relative overflow-hidden"
    aria-labelledby="features-heading"
  >
    <VideoBackground
      src="https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8"
      overlayClassName="bg-background/70 dark:bg-background/75 [.oled_&]:bg-background/80"
    />
    <div className="container mx-auto px-4 relative z-10">
      <h2
        id="features-heading"
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-14"
      >
        Everything You Need to Track &amp; Survey
      </h2>
      <div className="space-y-16 sm:space-y-24 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <FeatureRow key={f.title} feature={f} reversed={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
