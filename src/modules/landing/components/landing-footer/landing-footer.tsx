import Link from "next/link";
import { BRAND_NAME } from "../../constants";
import { rightMenuItems } from "../../data/navigation";
import "./landing-footer.scss";

/**
 * Mục 11: Chân trang (LandingFooter)
 * - Giữ dải núi và đoạn ghi nhận tài trợ UN Women / GenAct / TUVA.
 * - Hàng liên kết: Trang chủ · Tin tức · Fanpage · Hỗ trợ (Facebook mở tab mới).
 * - Dòng bản quyền: © {năm hiện tại} STEAMaze.
 * - KHÔNG thêm link tới trang chưa tồn tại (như Chính sách quyền riêng tư); có comment TODO.
 */
function LandingFooter() {
  const currentYear = new Date().getFullYear();
  const supportLink =
    rightMenuItems.find((item) => item.label === "HỖ TRỢ")?.href ??
    "https://www.facebook.com/profile.php?id=61595040895107";

  return (
    <>
      <div className="mountain-divider" aria-hidden="true">
        <svg viewBox="0 0 1200 130" preserveAspectRatio="none">
          <path
            className="mountain-fill"
            d="M0,56.0 Q38.5,61.2 76.9,65.0 Q138.5,60.3 200.0,56.4 Q237.4,60.6 274.7,65.0
               Q337.4,61.2 400.0,57.3 Q443.5,61.4 487.1,65.0 Q543.5,66.1 600.0,67.8
               Q650.0,65.9 699.9,65.0 Q750.0,67.4 800.0,68.3 Q851.8,66.5 903.6,65.0
               Q951.8,62.4 1000.0,60.5 Q1063.2,62.8 1126.3,65.0 Q1163.2,60.7 1200.0,57.0
               L1200,130 L0,130 Z"
          />
        </svg>
      </div>

      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <nav className="landing-footer__nav" aria-label="Liên kết chân trang">
            <Link href="/" className="landing-footer__link">
              Trang chủ
            </Link>
            <span className="landing-footer__dot" aria-hidden="true">
              ·
            </span>
            <Link href="/tin-tuc" className="landing-footer__link">
              Tin tức
            </Link>
            <span className="landing-footer__dot" aria-hidden="true">
              ·
            </span>
            <Link href="/fanpage" className="landing-footer__link">
              Fanpage
            </Link>
            <span className="landing-footer__dot" aria-hidden="true">
              ·
            </span>
            <a
              href={supportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-footer__link"
            >
              Hỗ trợ
            </a>

            {/* TODO: Cần tạo trang Chính sách quyền riêng tư (/privacy) cho dự án
                (bắt buộc cho màn hình xin quyền Google OAuth và vì ứng dụng phục vụ đối tượng học sinh/trẻ em).
                Sau khi tạo trang và route /chinh-sach-quyen-rieng-tu, bổ sung liên kết vào đây. */}
          </nav>

          <p className="landing-footer__credit">
            Dự án <strong>{BRAND_NAME}</strong> được tài trợ bởi dự án{" "}
            <strong>GenAct</strong> - Sáng kiến do{" "}
            <strong>UN Women Việt Nam</strong> phối hợp với{" "}
            <strong>TUVA Communication</strong> tổ chức, tìm kiếm và hỗ trợ các
            nhóm thanh niên phát triển các giải pháp số nhằm giải quyết những
            thách thức về bình đẳng giới, đặc biệt hướng tới phụ nữ và các nhóm
            yếu thế trong kỷ nguyên chuyển đổi số.
          </p>

          <p className="landing-footer__copyright">
            © {currentYear} {BRAND_NAME}. Mọi quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </>
  );
}

export { LandingFooter };
