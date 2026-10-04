import React from "react";
import { Youtube } from "lucide-react";
import { exerciseYoutubeLink } from "./ExerciseYoutubeLink.styles.js";

export function ExerciseYoutubeLink({ exercise }) {
  return (
    <a
      className={`${exerciseYoutubeLink} exercise-youtube-link`}
      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Search YouTube for ${exercise.name} (opens in a new tab)`}
      title={`Search YouTube for ${exercise.name} (opens in a new tab)`}
    >
      <Youtube size={17} aria-hidden="true" />
      YouTube
    </a>
  );
}
