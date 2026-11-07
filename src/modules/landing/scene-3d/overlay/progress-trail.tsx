"use client";

import { CAMERA_STOPS } from "../data/stops";

export interface ProgressTrailProps {
  activeIndex: number;
  onSelectStop: (index: number) => void;
}

export function ProgressTrail({ activeIndex, onSelectStop }: ProgressTrailProps) {
  return (
    <nav className="progress-trail" aria-label="Tiến độ hành trình qua các chặng">
      <ul className="progress-trail__list">
        {CAMERA_STOPS.map((stop, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={stop.id} className="progress-trail__item">
              <button
                type="button"
                className={`progress-trail__dot ${
                  isActive ? "progress-trail__dot--active" : ""
                }`}
                onClick={() => onSelectStop(index)}
                aria-label={`Chặng ${index + 1}: ${stop.name}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="progress-trail__tooltip" role="tooltip">
                  <strong>{stop.name}</strong>
                  <span>{stop.subtitle}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

