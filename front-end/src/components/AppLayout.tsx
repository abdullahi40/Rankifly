import { Outlet } from "react-router-dom";
import { useTheme } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Moon, Search, Sparkles, SunMedium } from "lucide-react";

export default function AppLayout() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),hsl(228_14%_8%)] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_28%),hsl(228_14%_8%)]">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="premium-header sticky top-0 z-20 flex h-18 items-center justify-between px-5 md:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-full border border-border/80 bg-background/40 text-muted-foreground hover:text-foreground" />
            </div>

            <div className="flex items-center gap-3">
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 text-muted-foreground transition hover:text-foreground"
                aria-label="Toggle notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </button>
              <button
                type="button"
                aria-label="Toggle color mode"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 text-muted-foreground transition hover:text-foreground"
              >
                {isDark ? (
                  <SunMedium className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <div className="flex items-center gap-3 rounded-full border border-border bg-background/40 px-2.5 py-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  R
                </div>
                <div className="hidden text-left md:block">
                  <div className="text-sm font-medium text-foreground">
                    Rankifly
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Pro
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="mx-auto w-full max-w-7xl p-5 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
