import Image from "next/image";
import Link from "next/link";
import { Reveal } from "../reveal";
import "./cta-section.scss";

/**
 * Mục 10: Khối kêu gọi cuối trang (CTA Section)
 * - Nền pappermap.webp / đỏ nâu ấm
 * - Chú chuột chuotuser.webp
 * - Phía sau mờ nhẹ 3 ảnh game nhỏ nghiêng như quạt bài
 * - Tiêu đề Zahra: "Sẵn sàng phiêu lưu cùng chú chuột?"
 * - Dòng phụ: "Miễn phí, chơi ngay trên trình duyệt, không cần cài đặt."
 * - Nút CHƠI NGAY lớn dẫn tới /lessons
 */
function CtaSection() {
  return (
    <section
      className="landing-cta"
      id="tham-gia"
      aria-labelledby="cta-title"
    >
      {/* Nền bản đồ giấy cổ */}
      <div className="landing-cta__bg-map" aria-hidden="true" />

      {/* 3 thẻ game mờ nhẹ xếp nghiêng phía sau */}
      <div className="landing-cta__faint-fan" aria-hidden="true">
        <div className="landing-cta__fan-card landing-cta__fan-card--left">
          <Image
            src="/images/landing/game-sau-rieng.webp"
            alt=""
            width={380}
            height={184}
            sizes="380px"
          />
        </div>
        <div className="landing-cta__fan-card landing-cta__fan-card--center">
          <Image
            src="/images/landing/game-nguyen-tu-khoi.webp"
            alt=""
            width={420}
            height={203}
            sizes="420px"
          />
        </div>
        <div className="landing-cta__fan-card landing-cta__fan-card--right">
          <Image
            src="/images/landing/game-guong-than.webp"
            alt=""
            width={380}
            height={184}
            sizes="380px"
          />
        </div>
      </div>

      <div className="landing-cta__inner">
        <Reveal className="landing-cta__content">
          <div className="landing-cta__mascot-wrap">
            <div className="landing-cta__mascot-glow" aria-hidden="true" />
            <Image
              src="/images/chuotuser.webp"
              alt="Chú chuột Whisker - linh vật STEAMaze"
              width={340}
              height={340}
              className="landing-cta__mascot-img"
              sizes="(max-width: 768px) 220px, 340px"
            />
          </div>

          <div className="landing-cta__text-wrap">
            <span className="landing-cta__pill">KHÁM PHÁ NGAY HÔM NAY</span>
            <h2 id="cta-title" className="landing-cta__title">
              Sẵn sàng phiêu lưu cùng Whisker?
            </h2>
            <p className="landing-cta__subtitle">
              Miễn phí, chơi ngay trên trình duyệt, không cần cài đặt.
            </p>

            <div className="landing-cta__actions">
              <Link href="/lessons" className="landing-cta__btn-play">
                <span className="landing-cta__btn-icon" aria-hidden="true">
                  🎮
                </span>
                <span className="landing-cta__btn-text">CHƠI NGAY – MIỄN PHÍ</span>
                <span className="landing-cta__btn-arrow" aria-hidden="true">
                  ▶
                </span>
              </Link>
            </div>

            <p className="landing-cta__note">
              ⚡ Đăng nhập bằng Google trong 1 giây · Học vui mỗi ngày cùng bạn bè
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { CtaSection };

