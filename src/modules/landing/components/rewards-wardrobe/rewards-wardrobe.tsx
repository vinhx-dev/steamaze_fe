"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth";
import { wardrobeItems } from "../../data/content";
import { Reveal } from "../reveal";
import "./rewards-wardrobe.scss";

function RewardsWardrobe() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handlePlayClick = () => {
    if (isAuthenticated || user) {
      router.push("/lessons");
    } else {
      router.push("/login?next=/lessons");
    }
  };

  return (
    <section
      className="rewards-wardrobe"
      id="phan-thuong"
      aria-labelledby="rewards-title"
    >
      <div className="rewards-wardrobe__inner">
        {/* Cột trái: Nội dung mô tả */}
        <div className="rewards-wardrobe__content-col">
          <Reveal>
            <span className="rewards-wardrobe__tag">TỦ ĐỒ &amp; PHẦN THƯỞNG</span>
            <h2 className="rewards-wardrobe__title" id="rewards-title">
              Qua màn – nhận đồ – mặc lên nhân vật
            </h2>
            <p className="rewards-wardrobe__desc">
              Hoàn thành bài học trên 70% là có xu. Dùng xu đổi vật phẩm và mặc
              lên nhân vật ngay trong trò chơi, như chú chuột Whisker đội vương miện,
              đeo kính râm và mặt nạ hacker này. Càng chơi tủ đồ càng đầy!
            </p>

            <button
              className="rewards-wardrobe__btn"
              type="button"
              onClick={handlePlayClick}
            >
              <span>Chơi để nhận quà →</span>
            </button>
          </Reveal>
        </div>

        {/* Cột phải: Khung chú chuột phóng to + 3 món đồ lơ lửng */}
        <div className="rewards-wardrobe__showcase-col">
          <Reveal delayMs={140}>
            <div className="rewards-wardrobe__stage">
              {/* Khung tròn phóng to chú chuột đội đồ */}
              <div className="rewards-wardrobe__mascot-frame">
                <div className="rewards-wardrobe__mascot-crop">
                  <Image
                    className="rewards-wardrobe__mascot-img"
                    src="/images/landing/game-nguyen-tu-khoi.webp"
                    alt="Chú chuột Whisker thám hiểm đội vương miện, kính râm và mặt nạ hacker trong trò chơi"
                    fill
                    sizes="400px"
                    loading="lazy"
                  />
                </div>
                <div className="rewards-wardrobe__frame-ring" aria-hidden="true" />
              </div>

              {/* 3 món đồ phụ kiện bay xung quanh */}
              <div className="rewards-wardrobe__items-group">
                {wardrobeItems.map((item, index) => {
                  const posClass = `rewards-wardrobe__item--pos-${index + 1}`;
                  return (
                    <div
                      key={item.name}
                      className={`rewards-wardrobe__item-card ${posClass}`}
                    >
                      <div className="rewards-wardrobe__item-img-wrap">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={72}
                          height={72}
                          className="rewards-wardrobe__item-img"
                          loading="lazy"
                        />
                      </div>
                      <span className="rewards-wardrobe__item-name">
                        {item.name}
                      </span>
                      <span className="rewards-wardrobe__item-slot">
                        {item.slot}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export { RewardsWardrobe };

