import { IconButton } from "../../common/IconButton/IconButton.jsx";
import {
  appShell,
  sidebar,
  workspaceLabel,
  navItem,
  navIndicator,
  sidebarBottom,
  miniBars,
  localLabel,
  mainShell,
  topbar,
  desktopBreadcrumb,
  mobileBrand,
  topbarRight,
  todayLabel,
  avatar,
  mainContent,
  pageFooter,
} from "./AppLayout.styles.js";
import { smallLabel } from "../../common/styles/Typography.styles.js";
import React from "react";
import {
  CalendarDays,
  ChevronRight,
  History,
  LogOut,
  Palette,
  TrendingUp,
} from "lucide-react";
import { Brand } from "../Brand/Brand.jsx";

export function AppLayout({
  view,
  setView,
  user,
  signingOut,
  logout,
  onAppearance,
  children,
}) {
  return (
    <div className={`${appShell} app-shell`}>
      <aside className={`${sidebar} sidebar`}>
        <Brand />
        <div className={`${workspaceLabel} workspace-label`}>
          YOUR WORKSPACE
        </div>
        <nav aria-label="Main navigation">
          {[
            ["planner", CalendarDays, "Weekly planner"],
            ["history", History, "Workout history"],
            ["progress", TrendingUp, "My progress"],
          ].map(([id, Icon, label]) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              className={`${navItem} ${view === id ? "nav-item active" : "nav-item"}`}
              onClick={() => setView(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {id === view && (
                <span className={`${navIndicator} nav-indicator`} />
              )}
            </button>
          ))}
        </nav>
        <div className={`${sidebarBottom} sidebar-bottom`}>
          <div className={`${smallLabel} small-label`}>THE LONG GAME</div>
          <p>
            A little stronger.
            <br />
            Every single week.
          </p>
          <div className={`${miniBars} mini-bars`}>
            {[25, 36, 32, 48, 57, 70, 90].map((h, i) => (
              <i key={i} style={{ height: h + "%" }} />
            ))}
          </div>
          <div className={`${localLabel} local-label`}>
            <span />
            {user ? "Saved to your account" : "Saved on this computer"}
          </div>
        </div>
      </aside>
      <div className={`${mainShell} main-shell`}>
        <header className={`${topbar} topbar`}>
          <span className={`${desktopBreadcrumb} desktop-breadcrumb`}>
            Workspace <ChevronRight size={14} />{" "}
            <strong>
              {view === "planner"
                ? "Weekly planner"
                : view === "history"
                  ? "Workout history"
                  : "My progress"}
            </strong>
          </span>
          <div className={`${mobileBrand} mobile-brand`}>
            <Brand />
          </div>
          <span className={`${topbarRight} topbar-right`}>
            <span className={`${todayLabel} today-label`}>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className={`${avatar} avatar`} title={user.email}>
              {user.email?.slice(0, 2).toUpperCase() || "YOU"}
            </span>
            {user && (
              <IconButton
                aria-label="Appearance"
                title="Appearance"
                onClick={onAppearance}
              >
                <Palette size={18} />
              </IconButton>
            )}
            {user && (
              <IconButton
                className="signout-button"
                aria-label="Sign out"
                title={`Sign out of ${user.email}`}
                disabled={signingOut}
                onClick={logout}
              >
                <LogOut size={18} />
              </IconButton>
            )}
          </span>
        </header>
        <main className={mainContent}>
          {children}
          <footer className={`${pageFooter} page-footer`}>
            <span>FORM / BUILT ONE REP AT A TIME</span>
            <span>Make consistency your personal best.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
