const activities = [
  { id: 1, text: "Alex Thompson made a sale", amount: "$99", time: "2 min ago", type: "sale" as const },
  { id: 2, text: "Sarah Chen reached 125 sales", amount: "", time: "8 min ago", type: "milestone" as const },
  { id: 3, text: "New affiliate Jordan Lee joined", amount: "", time: "15 min ago", type: "join" as const },
  { id: 4, text: "Marcus Williams made a sale", amount: "$149", time: "22 min ago", type: "sale" as const },
  { id: 5, text: "Emily Parker made a sale", amount: "$99", time: "34 min ago", type: "sale" as const },
];

export function ActivityFeed() {
  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <div key={a.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${a.type === "sale" ? "bg-success" : a.type === "milestone" ? "bg-warning" : "bg-accent"}`} />
            <span className="text-sm text-foreground">{a.text}</span>
          </div>
          <div className="flex items-center gap-3">
            {a.amount && <span className="text-sm font-semibold text-primary">{a.amount}</span>}
            <span className="text-xs text-muted-foreground">{a.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}