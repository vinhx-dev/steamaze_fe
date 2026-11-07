import { BRAND_NAME } from "../../constants";
import { missionStatement, teamRoles } from "../../data/content";
import { Reveal } from "../reveal";
import "./about-mission-team.scss";

/**
 * Mục 9: Sứ mệnh & đội ngũ (Bản rút gọn)
 * id="ve-chung-toi"
 * Gộp 2 mục cũ thành 1 mục thấp gọn:
 * - Trái: trích dẫn sứ mệnh + 3 chip
 * - Phải: giới thiệu nhóm 4 người + 4 vai trò dạng hàng nhỏ gọn
 */
function AboutMissionTeam() {
  return (
    <section
      className="about-mission-team"
      id="ve-chung-toi"
      aria-labelledby="mission-team-title"
    >
      <div className="about-mission-team__inner">
        <Reveal>
          <div className="about-mission-team__header">
            <span className="about-mission-team__badge">VỀ CHÚNG TÔI</span>
            <h2 id="mission-team-title" className="about-mission-team__main-title">
              Sứ Mệnh & Đội Ngũ Sáng Lập {BRAND_NAME}
            </h2>
          </div>
        </Reveal>

        <div className="about-mission-team__layout">
          {/* Cột trái: Sứ mệnh & 3 cam kết */}
          <Reveal delayMs={100} className="about-mission-team__col about-mission-team__col--mission">
            <div className="about-mission-team__mission-card">
              <span className="about-mission-team__label">CAM KẾT CỦA CHÚNG TÔI</span>
              <blockquote className="about-mission-team__quote">
                {missionStatement.quote}
              </blockquote>

              <div
                className="about-mission-team__chips"
                aria-label="3 giá trị cốt lõi"
              >
                {missionStatement.chips.map((chip, idx) => (
                  <span key={idx} className="about-mission-team__chip">
                    ✨ {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Cột phải: Đội ngũ 4 người */}
          <Reveal delayMs={200} className="about-mission-team__col about-mission-team__col--team">
            <div className="about-mission-team__team-card">
              <h3 className="about-mission-team__team-title">
                Nhóm 4 người yêu giáo dục và công nghệ
              </h3>
              <p className="about-mission-team__team-subtitle">
                Kết hợp giữa chuyên môn sư phạm, kỹ thuật AI và thiết kế trò chơi để mang lại trải nghiệm học tập tốt nhất.
              </p>

              <ul className="about-mission-team__role-list">
                {teamRoles.map((role) => (
                  <li key={role.number} className="about-mission-team__role-item">
                    <span className="about-mission-team__role-icon" aria-hidden="true">
                      {role.icon}
                    </span>
                    <div className="about-mission-team__role-content">
                      <strong className="about-mission-team__role-name">
                        {role.title}
                      </strong>
                      <span className="about-mission-team__role-desc">
                        {role.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export { AboutMissionTeam };

