import {
  recordsCard,
  emptyRecords,
  recordGrid,
  record,
  recordValue,
} from "./PersonalRecords.styles.js";
import { viewToolbar, tag } from "../../common/styles/ViewControls.styles.js";
import React from "react";
import { Trophy } from "lucide-react";

export function PersonalRecords({ prs }) {
  return (
    <section className={`${recordsCard} records-card`}>
      <div className={`${viewToolbar} view-toolbar`}>
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
        <span className={`${tag} tag`}>ALL TIME</span>
      </div>
      {!prs.length ? (
        <div className={`${emptyRecords} empty-records`}>
          Your first logged set becomes your first benchmark.
        </div>
      ) : (
        <div className={`${recordGrid} record-grid`}>
          {prs.map((pr) => (
            <div className={`${record} record`} key={pr.id}>
              <span>
                <strong>{pr.name}</strong>
                <small>
                  {new Date(pr.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </span>
              <span className={`${recordValue} record-value`}>
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
