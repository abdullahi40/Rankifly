import { Compass, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Discover() {
  return (
    <div className="space-y-6 p-6">
      <div className="soft-panel rounded-3xl p-6 md:p-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          <Compass className="h-3.5 w-3.5" />
          Discover
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
          Discover experiences
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Browse the available creator experiences and open their specific
          detail pages.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { id: "exp-101", name: "Creator Growth Lab" },
          { id: "exp-202", name: "Affiliate Launch" },
          { id: "exp-303", name: "VIP Campaign" },
        ].map((experience) => (
          <Link
            key={experience.id}
            to={`/experiences/${experience.id}`}
            className="soft-panel group rounded-2xl p-5 transition hover:border-primary/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Experience
                </p>
                <h2 className="mt-2 text-xl font-bold text-foreground">
                  {experience.name}
                </h2>
              </div>
              <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Open the experience detail route at /experiences/{experience.id}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
