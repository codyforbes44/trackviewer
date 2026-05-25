import { Link } from "react-router-dom";
import { MapPin, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import VideoBackground from "@/components/VideoBackground";

const CTASection = () => {
  const { user } = useAuth();

  return (
    <aside className="py-20 sm:py-24 relative overflow-hidden" aria-label="Call to action">
      <VideoBackground
        src="https://stream.mux.com/JNJEOYI6B3EffB9f5ZhpGbuxzc6gSyJcXaCBbCgZKRg.m3u8"
        overlayClassName="bg-background/60 dark:bg-background/70 [.oled_&]:bg-background/75"
      />

      <div className="container mx-auto px-4 text-center max-w-3xl space-y-6 relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
          Track Devices. Survey Sites.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-primary">
            All in One Map.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Real-time GPS tracking links plus a 3D site survey for any address —
          terrain, elevation, contours, sun path and weather. Free for personal use.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button
              size="lg"
              className="gap-2 text-base px-8 shadow-elevated w-full sm:w-auto h-12"
            >
              <MapPin className="w-5 h-5" aria-hidden="true" />
              {user ? "Go to Dashboard" : "Start Free"}
            </Button>
          </Link>
          <Link to={user ? "/site-survey" : "/auth"}>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 w-full sm:w-auto h-12"
            >
              <Mountain className="w-5 h-5" aria-hidden="true" />
              Try Site Survey
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default CTASection;
