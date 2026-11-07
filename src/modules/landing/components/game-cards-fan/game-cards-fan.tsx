"use client";

import { landingGames, type LandingGame } from "../../data/content";
import { GameScreen } from "../game-screen";
import "./game-cards-fan.scss";

// Thứ tự hiển thị dạng quạt: Sầu Riêng (trái) · Nguyên Tử Khối (giữa) · Gương Thần (phải)
const FAN_ORDER = ["game-sau-rieng", "game-nguyen-tu-khoi", "game-guong-than"];

function GameCardsFan() {
  const gamesMap = new Map<string, LandingGame>(
    landingGames.map((g) => [g.id, g]),
  );

  const fanGames = FAN_ORDER.map((id) => gamesMap.get(id)).filter(
    Boolean,
  ) as LandingGame[];

  const scrollToGame = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="game-cards-fan" aria-label="Xem nhanh ba trò chơi">
      <div className="game-cards-fan__inner">
        <div className="game-cards-fan__track">
          {fanGames.map((game, index) => {
            let roleClass = "game-cards-fan__card--center";
            if (index === 0) roleClass = "game-cards-fan__card--left";
            if (index === 2) roleClass = "game-cards-fan__card--right";

            return (
              <a
                key={game.id}
                href={`#${game.id}`}
                onClick={(e) => scrollToGame(game.id, e)}
                className={`game-cards-fan__card ${roleClass}`}
                aria-label={`Cuộn tới trò chơi ${game.title} môn ${game.subject}`}
              >
                <div className="game-cards-fan__screen-wrap">
                  <GameScreen game={game} zoomOnHover={false} />
                  <div className="game-cards-fan__tap-hint">
                    <span>Xem chi tiết ▾</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { GameCardsFan };
