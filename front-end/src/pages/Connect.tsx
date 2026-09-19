import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Plug,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { syncAffiliates } from "@/services/leaderboard";

export default function Connect() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const syncMutation = useMutation({
    mutationFn: syncAffiliates,
    onSuccess: (data) => {
      toast({
        title: "Affiliates synced",
        description: `${data.importedAffiliates} affiliates imported, ${data.importedSales} sales synced.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Sync failed",
        description:
          error instanceof Error ? error.message : "Unable to sync affiliates.",
      });
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8 text-center">
        {step === 0 && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary glow-primary">
              <Plug className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Connect Your Whop Account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Link your Whop seller account to Rankifly and start tracking
                affiliate performance with real-time Discord notifications.
              </p>
            </div>

            <div className="grid gap-4 text-left">
              {[
                {
                  icon: BarChart3,
                  title: "Track Performance",
                  desc: "Real-time leaderboard with sales, revenue, and points",
                },
                {
                  icon: Zap,
                  title: "Discord Alerts",
                  desc: "Instant notifications on sales and milestones",
                },
                {
                  icon: Shield,
                  title: "Secure Connection",
                  desc: "OAuth-based integration with your Whop account",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" size="lg" onClick={() => setStep(1)}>
              Connect Whop Account <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                You're All Set! 🎉
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your Whop account is connected. Affiliate data will start
                populating as sales come in.
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-card p-5 text-left glow-primary">
              <h3 className="font-semibold text-foreground mb-2">
                Quick Setup Checklist
              </h3>
              <div className="space-y-2">
                {[
                  { text: "Connect Whop account", done: true },
                  { text: "Sync existing affiliates", done: false },
                  { text: "Set up Discord webhook", done: false },
                  { text: "Share public leaderboard", done: false },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full border ${
                        item.done
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      } flex items-center justify-center`}
                    >
                      {item.done && (
                        <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        item.done
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isLoading}
            >
              {syncMutation.isLoading
                ? "Syncing affiliates..."
                : "Sync existing affiliates"}
            </Button>

            <Button
              className="w-full"
              variant="ghost"
              onClick={() => (globalThis.location.href = "/")}
            >
              Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
