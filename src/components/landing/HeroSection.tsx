import { Link } from "react-router-dom";
import { MapPin, ChevronDown, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import VideoBackground from "@/components/VideoBackground";

const MapMockup = () => (
  <div className="relative w-full aspect-square max-w-md mx-auto">
    <div className="absolute inset-0 rounded-2xl bg-secondary/80 border border-border/50 overflow-hidden shadow-elevated">
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="hsl(var(--primary))" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v-${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="hsl(var(--primary))" strokeWidth="0.5" />
        ))}
      </svg>
      <div className="absolute top-[30%] left-0 right-0 h-px bg-primary/30" />
      <div className="absolute top-[55%] left-0 right-0 h-px bg-primary/20" />
      <div className="absolute left-[40%] top-0 bottom-0 w-px bg-primary/30" />
      <div className="absolute left-[65%] top-0 bottom-0 w-px bg-primary/20" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
        <path d="M20 80 Q35 60 45 50 T70 30" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 2" className="animate-[dash_3s_linear_infinite]" opacity="0.6" />
      </svg>
      <div className="absolute top-[75%] left-[22%] w-3 h-3 rounded-full bg-primary/50 border border-primary/80" />
      <div className="absolute top-[32%] left-[62%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-primary/30 animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary)/0.6)] border-2 border-primary-foreground" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">Live Tracking</span>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>40.7128° N, 74.0060° W</span>
          <span>2s ago</span>
        </div>
      </div>
    </div>
  </div>
);

const trustItems = [
  "No credit card required",
  "Free forever for personal use",
  "No app install for trackers",
  "3D terrain on any address",
];

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <header className="relative min-h-[calc(100dvh-4rem)] sm:min-h-0 sm:py-20 lg:py-28 overflow-hidden flex items-center">
      <VideoBackground
        src="https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8"
        overlayClassName="bg-background/50 dark:bg-background/60 [.oled_&]:bg-background/70"
      />

      <div className="container mx-auto px-4 relative z-10 py-8 sm:py-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium animate-[fadeInUp_0.5s_ease-out_both]"
              style={{ animationDelay: "0ms" }}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Real-Time Tracking · 3D Site Survey
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] animate-[fadeInUp_0.5s_ease-out_both]"
              style={{ animationDelay: "100ms" }}
            >
              Track Anything.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                Know Anywhere.
              </span>
            </h1>

            <p
              id="hero-description"
              className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed animate-[fadeInUp_0.5s_ease-out_both]"
              style={{ animationDelay: "200ms" }}
            >
              Generate shareable tracking links for live GPS — then dig deeper
              with a 3D site survey: terrain, elevation, slope, contour lines,
              sun path and live weather for any address on Earth.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-[fadeInUp_0.5s_ease-out_both]"
              style={{ animationDelay: "300ms" }}
            >
              <Link to={user ? "/dashboard" : "/auth"} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 shadow-elevated w-full sm:w-auto h-12"
                >
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  Start Free
                </Button>
              </Link>
              <Link to={user ? "/site-survey" : "/auth"} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-base px-8 w-full sm:w-auto h-12 border border-border/50"
                >
                  <Mountain className="w-5 h-5" aria-hidden="true" />
                  Open Site Survey
                </Button>
              </Link>
            </div>

            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 animate-[fadeInUp_0.5s_ease-out_both]"
              style={{ animationDelay: "400ms" }}
            >
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 text-xs sm:text-sm text-muted-foreground border border-border/40"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Map mockup */}
          <div className="hidden sm:block">
            <MapMockup />
          </div>
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <a
        href="#value-prop"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 sm:hidden animate-[fadeInUp_0.5s_ease-out_both] flex flex-col items-center gap-1"
        style={{ animationDelay: "600ms" }}
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Scroll</span>
        <ChevronDown className="w-5 h-5 text-muted-foreground/70 animate-bounce" />
      </a>
    </header>
  );
};

export default HeroSection;
