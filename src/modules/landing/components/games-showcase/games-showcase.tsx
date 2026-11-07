"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth";
import { landingGames } from "../../data/content";
import { GameScreen } from "../game-screen";
import { Reveal } from "../reveal";
import "./games-showcase.scss";

function GamesShowcase() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handlePlayGame = () => {
    if (isAuthenticated || user) {
      router.push("/lessons");
    } else {
      router.push("/login?next=/lessons");
    }
  };

  return (
    <section
      className="games-showcase"
      id="tro-choi"
      aria-labelledby="games-showcase-title"
    >
      <div className="games-showcase__inner">
        <Reveal>
          <div className="games-showcase__header">
            <h2 className="games-showcase__title" id="games-showcase-title">
              Vui ở đâu? Ba trò chơi, ba môn học
            </h2>
            <p className="games-showcase__subtitle">
              Mỗi trò chơi là một bài học. Chơi xong mới thấy: à, hoá ra là vậy!
            </p>
          </div>
        </Reveal>

        <div className="games-showcase__list">
          {landingGames.map((game, index) => {
            const isReversed = index % 2 === 1;

            return (
              <article
                key={game.id}
                id={game.id}
                className={`games-showcase__row ${
                  isReversed ? "games-showcase__row--reversed" : ""
                }`}
                aria-labelledby={`game-title-${game.id}`}
              >
                {/* Cột khung ảnh trò chơi */}
                <div className="games-showcase__media-col">
                  <Reveal>
                    <GameScreen game={game} showHotspots={true} />

                    {/* Danh sách chú thích số cho mobile */}
                    <div className="games-showcase__mobile-hotspots">
                      <span className="games-showcase__mobile-hotspots-title">
                        Điểm nổi bật trên màn hình:
                      </span>
                      <ul className="games-showcase__mobile-hotspots-list">
                        {game.hotspots.map((h) => (
                          <li key={h.number}>
                            <span
                              className="games-showcase__mobile-hotspot-num"
                              style={{ backgroundColor: game.subjectColor }}
                            >
                              {h.number}
                            </span>
                            <span>{h.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>

                {/* Cột thông tin chi tiết */}
                <div className="games-showcase__info-col">
                  <Reveal delayMs={120}>
                    <div className="games-showcase__badges">
                      <span
                        className="games-showcase__subject-badge"
                        style={{ backgroundColor: game.subjectColor }}
                      >
                        {game.subject}
                      </span>
                      <span className="games-showcase__control-badge">
                        {game.control}
                      </span>
                    </div>

                    <h3
                      className="games-showcase__game-title"
                      id={`game-title-${game.id}`}
                    >
                      {game.title}
                    </h3>

                    <p className="games-showcase__desc">{game.description}</p>

                    <div className="games-showcase__learnings">
                      <h4 className="games-showcase__learnings-title">
                        ✨ Bạn sẽ học được:
                      </h4>
                      <ul className="games-showcase__learnings-list">
                        {game.learnings.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="games-showcase__action-btn"
                      type="button"
                      onClick={handlePlayGame}
                    >
                      <span>Chơi thử ngay →</span>
                    </button>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { GamesShowcase };
