import Image from "next/image";
import type { LandingGame } from "../../data/content";
import "./game-screen.scss";

interface GameScreenProps {
  game: LandingGame;
  showHotspots?: boolean;
  priority?: boolean;
  className?: string;
  zoomOnHover?: boolean;
}

function GameScreen({
  game,
  showHotspots = false,
  priority = false,
  className = "",
  zoomOnHover = true,
}: GameScreenProps) {
  return (
    <div
      className={`game-screen ${zoomOnHover ? "game-screen--hoverable" : ""} ${className}`}
    >
      {/* Thanh tiêu đề cửa sổ trò chơi */}
      <div className="game-screen__header">
        <div className="game-screen__dots" aria-hidden="true">
          <span className="game-screen__dot game-screen__dot--red" />
          <span className="game-screen__dot game-screen__dot--yellow" />
          <span className="game-screen__dot game-screen__dot--green" />
        </div>
        <span className="game-screen__title">{game.title}</span>
        <span
          className="game-screen__badge"
          style={{ backgroundColor: game.subjectColor }}
        >
          {game.subject}
        </span>
      </div>

      {/* Khung ảnh trò chơi */}
      <div className="game-screen__viewport">
        <Image
          className="game-screen__image"
          src={game.image}
          alt={game.imageAlt}
          width={1280}
          height={620}
          sizes="(max-width: 768px) 100vw, 1100px)"
          loading={priority ? undefined : "lazy"}
          priority={priority}
          style={{ objectPosition: game.objectPosition }}
        />

        {/* Hotspots điểm chú thích */}
        {showHotspots && game.hotspots.length > 0 && (
          <div className="game-screen__hotspots" aria-hidden="true">
            {game.hotspots.map((h) => {
              const isRightSide = h.x > 60;
              const isBottomSide = h.y > 75;
              return (
                <div
                  key={h.number}
                  className={`game-screen__hotspot ${
                    isRightSide ? "game-screen__hotspot--flip-x" : ""
                  } ${isBottomSide ? "game-screen__hotspot--flip-y" : ""}`}
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                  }}
                >
                  <span
                    className="game-screen__pin"
                    style={{
                      borderColor: game.subjectColor,
                      backgroundColor: game.subjectColor,
                    }}
                  >
                    <span className="game-screen__pin-pulse" />
                    <span className="game-screen__pin-num">{h.number}</span>
                  </span>
                  <span className="game-screen__label">{h.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export { GameScreen };
export type { GameScreenProps };

