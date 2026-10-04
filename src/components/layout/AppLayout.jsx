import React from "react";
import {
  CalendarDays,
  ChevronRight,
  History,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { Brand } from "./Brand.jsx";

export function AppLayout({
  view,
  setView,
  user,
  signingOut,
  logout,
  children,
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav aria-label="Main navigation">
          {[
            ["planner", CalendarDays, "Weekly planner"],
            ["history", History, "Workout history"],
            ["progress", TrendingUp, "My progress"],
          ].map(([id, Icon, label]) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              className={view === id ? "nav-item active" : "nav-item"}
              onClick={() => setView(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {id === view && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="small-label">THE LONG GAME</div>
          <p>
            A little stronger.
            <br />
            Every single week.
          </p>
          <div className="mini-bars">
            {[25, 36, 32, 48, 57, 70, 90].map((h, i) => (
              <i key={i} style={{ height: h + "%" }} />
            ))}
          </div>
          <div className="local-label">
            <span />
            {user ? "Saved to your account" : "Saved on this computer"}
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span className="desktop-breadcrumb">
            Workspace <ChevronRight size={14} />{" "}
            <strong>
              {view === "planner"
                ? "Weekly planner"
                : view === "history"
                  ? "Workout history"
                  : "My progress"}
            </strong>
          </span>
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="topbar-right">
            <span className="today-label">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="avatar" title={user.email}>
              {user.email?.slice(0, 2).toUpperCase() || "YOU"}
            </span>
            {user && (
              <button
                className="icon-button signout-button"
                aria-label="Sign out"
                title={`Sign out of ${user.email}`}
                disabled={signingOut}
                onClick={logout}
              >
                <LogOut size={18} />
              </button>
            )}
          </span>
        </header>
        <main>
          {children}
          <footer className="page-footer">
            <span>FORM / BUILT ONE REP AT A TIME</span>
            <span>Make consistency your personal best.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
