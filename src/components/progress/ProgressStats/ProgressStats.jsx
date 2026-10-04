import { statGrid } from "./ProgressStats.styles.js";
import React from "react";
import { Activity, Dumbbell, Trophy } from "lucide-react";

export function ProgressStats({ completed, totalVolume, prs }) {
  return (
    <div className={`${statGrid} stat-grid`}>
      <div>
        <Dumbbell size={20} />
        <strong>{completed.length}</strong>
        <span>Workouts completed</span>
      </div>
      <div>
        <Activity size={20} />
        <strong>
          {totalVolume.toLocaleString()}
          <small> kg</small>
        </strong>
        <span>Total logged volume</span>
      </div>
      <div>
        <Trophy size={20} />
        <strong>{prs.length}</strong>
        <span>Exercise records</span>
      </div>
    </div>
  );
}
