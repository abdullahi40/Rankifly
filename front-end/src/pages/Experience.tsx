import { ArrowLeft, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function Experience() {
  const { experienceId } = useParams();

  return (
    <div className="space-y-6">
      <div className="soft-panel rounded-3xl p-6 md:p-7">
        <div className="mb-4 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Experience Detail
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Experience #{experienceId ?? "unknown"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              This route is now available at /experiences/:experienceId and is
              ready for the experience-specific dashboard or detail view.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="soft-panel rounded-2xl p-5">
          <p className="text-sm font-medium text-muted-foreground">
            Experience ID
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {experienceId ?? "Not provided"}
          </p>
        </div>

        <div className="soft-panel rounded-2xl p-5">
          <p className="text-sm font-medium text-muted-foreground">
            Route pattern
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            /experiences/:experienceId
          </p>
        </div>
      </div>
    </div>
  );
}
