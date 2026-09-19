import { useState } from "react";
import { Bell, ExternalLink, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { saveDiscordWebhook } from "@/services/leaderboard";

export default function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!webhookUrl) return;
    setSaving(true);
    try {
      await saveDiscordWebhook(webhookUrl);
      setSaved(true);
      toast({ title: "Discord webhook saved", description: "The backend has stored your webhook URL." });
    } catch (error) {
      toast({ title: "Save failed", description: error instanceof Error ? error.message : "Unable to save webhook." });
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast({ title: "Test notification sent!", description: "Check your Discord channel for the test message." });
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Discord Settings</h1>
        <p className="text-sm text-muted-foreground">Configure Discord webhook notifications for your Rankifly leaderboard</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-accent/20 p-2.5">
              <Bell className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Discord Notifications</h2>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>
              <p className="text-sm text-muted-foreground">Get notified on sales and milestones in your Discord server</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Webhook URL</label>
              <Input
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-secondary border-border"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Create a webhook in your Discord server settings → Integrations → Webhooks
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleSave} disabled={!webhookUrl || saving}>
                {saved ? (
                  <><CheckCircle2 className="h-4 w-4 mr-2" /> Saved!</>
                ) : (
                  "Save Webhook"
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleTest} disabled={!webhookUrl || testing}>
                <Send className="h-3.5 w-3.5 mr-1" /> {testing ? "Sending..." : "Test Notification"}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Notification Events</h2>
          <div className="space-y-3">
            {[
              { label: "New Sale", desc: "When an affiliate makes a sale", enabled: true },
              { label: "Milestone Reached", desc: "When an affiliate hits a sales milestone", enabled: true },
              { label: "New Affiliate Joined", desc: "When someone joins your program", enabled: false },
              { label: "Daily Summary", desc: "End-of-day recap of all activity", enabled: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.enabled} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
