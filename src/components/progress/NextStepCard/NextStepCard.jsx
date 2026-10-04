import { nextStepCard, suggestionList } from "./NextStepCard.styles.js";
import { textButton } from "../../common/styles/ViewControls.styles.js";
import React from "react";
import { TrendingUp } from "lucide-react";

export function NextStepCard({ suggestions, onPlan }) {
  return (
    <section className={`${nextStepCard} next-step-card`}>
      <TrendingUp size={24} />
      <h3>Your next step</h3>
      <p>
        {suggestions.length
          ? `${suggestions.length} exercise targets are ready to progress for the selected week.`
          : "Complete this week’s workouts to earn next week’s suggestions."}
      </p>
      <div className={`${suggestionList} suggestion-list`}>
        {suggestions.slice(0, 3).map(({ exercise, target }) => (
          <div key={exercise.id}>
            <strong>{exercise.name}</strong>
            <span>
              {target.sets} × {target.reps}
              {target.weight !== null && ` · ${target.weight} kg`}
            </span>
          </div>
        ))}
      </div>
      <button className={`${textButton} text-button`} onClick={onPlan}>
        See targets in your planner
      </button>
    </section>
  );
}
