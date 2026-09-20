import { Building2, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function CompanyDashboard() {
  const { companyId } = useParams();

  return (
    <div className="space-y-6 p-6">
      <div className="soft-panel rounded-3xl p-6 md:p-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          <Building2 className="h-3.5 w-3.5" />
          Company dashboard
        </div>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
          Company: {companyId ?? "unknown"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          This route is available at /dashboard/:companyId and is intended for
          company-specific analytics and access.
        </p>
      </div>

      <div className="soft-panel rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Company ID
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {companyId ?? "Not provided"}
            </p>
          </div>
          <Link
            to="/public/demo-company"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            View public board
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
