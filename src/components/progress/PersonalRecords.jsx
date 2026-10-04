import React from "react";
import { Trophy } from "lucide-react";

export function PersonalRecords({ prs }) {
  return (
    <section className="records-card">
      <div className="view-toolbar">
        <div>
          <h3>
            <Trophy size={19} />
            Personal records
          </h3>
          <p>
            Highest logged weight, then best reps at that weight. BW =
            bodyweight.
          </p>
        </div>
        <span className="tag">ALL TIME</span>
      </div>
      {!prs.length ? (
        <div className="empty-records">
          Your first logged set becomes your first benchmark.
        </div>
      ) : (
        <div className="record-grid">
          {prs.map((pr) => (
            <div className="record" key={pr.id}>
              <span>
                <strong>{pr.name}</strong>
                <small>
                  {new Date(pr.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </span>
              <span className="record-value">
                {pr.weight === null || pr.weight === 0 ? "BW" : pr.weight}
                <small>
                  {pr.weight ? " kg" : ""} × {pr.reps}
                </small>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
