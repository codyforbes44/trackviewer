import { useState } from "react";
import { Check, Star, Zap, Building2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PRO_PRICE_ID = "price_1SanVv2MfT7OzvjxIHQptGbC";

const plans = [
  {
    name: "Free",
    icon: Star,
    price: "$0",
    period: "forever",
    description: "Personal tracking and unlimited site surveys.",
    cta: "Get Started Free",
    highlighted: false,
    features: [
      "Up to 5 active trackers",
      "Real-time GPS updates & shareable links",
      "7-day location history",
      "Unlimited 3D Site Survey lookups",
      "Terrain, contours, hillshade & sun path",
      "Mobile-friendly dashboard",
      "Community support",
    ],
  },
  {
    name: "Pro",
    icon: Zap,
    price: "$12",
    period: "/month",
    description: "For builders, planners and field teams.",
    cta: "Upgrade to Pro",
    highlighted: true,
    features: [
      "Everything in Free",
      "Unlimited active trackers",
      "90-day location history",
      "Custom branding on tracking links",
      "Geofence alerts",
      "Site Survey PDF & GeoJSON export",
      "API access & webhooks",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "Tailored solutions for large-scale deployments.",
    cta: "Contact Sales",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Unlimited history retention",
      "SSO & SAML authentication",
      "Dedicated account manager",
      "Custom SLA & uptime guarantee",
      "On-premise deployment option",
      "Advanced analytics & audit logs",
      "Custom basemaps & data layers",
    ],
  },
];

const faqs = [
  { q: "Can I change plans at any time?", a: "Yes. You can upgrade, downgrade, or cancel your plan at any time from your dashboard. Changes take effect immediately." },
  { q: "Is the Free plan really free forever?", a: "Yes. The Free plan has no time limit — up to 5 active trackers and unlimited Site Survey lookups." },
  { q: "Does Site Survey count against my tracker limit?", a: "No. Site Survey is an independent feature available on every plan. Only your tracking links count toward the per-plan tracker limit." },
  { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on all paid plans. No questions asked." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise customers can pay via invoice." },
  { q: "Is there a discount for annual billing?", a: "Yes — annual billing saves you 20% compared to monthly. The discount is applied automatically when you select yearly billing." },
];

const Pricing = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const { user } = useAuth();
  const { isProUser } = useSubscription();
  const { toast } = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setCheckoutLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-checkout-session", {
        body: { priceId: PRO_PRICE_ID },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res.error) throw new Error(res.error.message);
      const { url } = res.data;
      if (url) window.location.href = url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({ title: "Error", description: err.message || "Failed to start checkout.", variant: "destructive" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mapme.live/" },
      { "@type": "ListItem", position: 2, name: "Pricing", item: "https://mapme.live/pricing" },
    ],
  };

  return (
    <Layout showFooter>
      <SEO
        title="Pricing — MᴀᴘMᴇ.Lɪᴠᴇ"
        description="Simple pricing for real-time GPS tracking and 3D site survey. Free for personal use — Pro for teams, builders and field crews."
        canonical="https://mapme.live/pricing"
        structuredData={breadcrumbData}
      />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div
          ref={heroRef}
          className={`text-center mb-16 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            One platform. Tracking + Terrain.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free with live GPS links and unlimited 3D site surveys.
            Upgrade when you need scale, exports, or API access.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {plans.map((plan, i) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-500 ${
                plan.highlighted
                  ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                  : "border-border hover:border-primary/40"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name === "Pro" ? (
                  isProUser ? (
                    <Badge className="w-full justify-center py-2 text-sm">Current Plan</Badge>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Redirecting…
                        </>
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  )
                ) : plan.name === "Enterprise" ? (
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/contact">{plan.cta}</Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full" variant="outline">
                    <Link to={user ? "/dashboard" : "/auth"}>{plan.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div
          ref={faqRef}
          className={`max-w-3xl mx-auto transition-all duration-700 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </Layout>
  );
};

export default Pricing;
