import React from "react";
import { Clock3, Dumbbell, Flame, Leaf, Plus, Target } from "lucide-react";
import { weekdayNames } from "../../utils/format.js";
import { ExerciseList } from "./ExerciseList.jsx";

export function WorkoutPanel({
  workout,
  state,
  week,
  session,
  completedDays,
  startWorkout,
  setTarget,
  setRoutineDay,
}) {
  const legDay = workout.exercises.some(
    (exercise) => exercise.muscle === "Legs",
  );
  return (
    <section className="workout-panel">
      <div className="section-kicker">
        THE PLAN FOR {weekdayNames[workout.weekday].toUpperCase()}
      </div>
      <div className="workout-heading">
        <div>
          <h2>
            {workout.title}
            <span className="tag">Strength</span>
          </h2>
          <p>{workout.subtitle}</p>
        </div>
        <span className="workout-duration">
          <Clock3 size={16} />
          45–60 min
        </span>
        <button
          className="button primary mobile-session-button"
          aria-label={session ? "Resume workout" : "Start workout"}
          onClick={startWorkout}
        >
          <Dumbbell size={17} />
          {session ? "Resume" : "Start"}
        </button>
      </div>
      <details className="session-recommendation">
        <summary className="session-strip">
          <Flame size={20} />
          <div>
            <strong>
              Warm up <span>· 5–8 min</span>
            </strong>
            <p>Easy cardio, dynamic mobility, then light practice sets.</p>
          </div>
          <Plus size={15} />
        </summary>
        <div className="recommendation-content">
          <ol>
            <li>3–5 minutes of easy cycling or brisk walking.</li>
            <li>
              {legDay
                ? "8 bodyweight squats, 8 hip hinges, and gentle leg swings."
                : "10 shoulder circles each way and 10 light band pull-aparts."}
            </li>
            <li>
              1–2 light practice sets before your first compound exercises,
              separate from your working sets.
            </li>
          </ol>
        </div>
      </details>
      <ExerciseList
        workout={workout}
        week={week}
        state={state}
        setRoutineDay={setRoutineDay}
        setTarget={setTarget}
      />
      <details className="session-recommendation">
        <summary className="session-strip cooldown">
          <Leaf size={20} />
          <div>
            <strong>
              Cool down <span>· 5 min</span>
            </strong>
            <p>Slow your breathing. Gently stretch the muscles you trained.</p>
          </div>
          <Plus size={15} />
        </summary>
        <div className="recommendation-content">
          <ol>
            <li>2 minutes of easy walking and relaxed breathing.</li>
            <li>
              {legDay
                ? "Gently stretch quads, hamstrings, glutes, and calves for 20–30 seconds each."
                : "Gently stretch chest, lats, shoulders, and arms for 20–30 seconds each."}
            </li>
            <li>
              Stay in a comfortable range and finish with water and a moment to
              recover.
            </li>
          </ol>
        </div>
      </details>
      <div className="workout-bottom">
        <span>
          <Target size={16} />
          Show up. Build the habit.
        </span>
        <button className="button primary" onClick={startWorkout}>
          <Dumbbell size={18} />
          {session
            ? "Resume workout"
            : completedDays.has(workout.id)
              ? "Log another session"
              : "Start workout"}
        </button>
      </div>
    </section>
  );
}
