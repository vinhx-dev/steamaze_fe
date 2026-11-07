import { AboutMissionTeam } from "../about-mission-team";
import { BenefitsSection } from "../benefits-section";
import { CtaSection } from "../cta-section";
import { GameCardsFan } from "../game-cards-fan";
import { GamesShowcase } from "../games-showcase";
import { HowItWorks } from "../how-it-works";
import { RewardsWardrobe } from "../rewards-wardrobe";
import { StatsTestimonials } from "../stats-testimonials";
import { TrustBar } from "../trust-bar";
import "./about-sections.scss";

/**
 * AboutSections: Tổng hợp các khối nội dung của trang chủ theo đúng thứ tự thiết kế:
 * 1. GameCardsFan: 3 thẻ game xòe quạt tràn lên chân Hero
 * 2. TrustBar: Thanh bảo chứng uy tín & nhà tài trợ
 * 3. BenefitsSection: Lợi ích học tập qua game (#loi-ich)
 * 4. GamesShowcase: Chi tiết 3 trò chơi giáo dục thật (#tro-choi)
 * 5. HowItWorks: Cách chơi trong 3 bước (#cach-choi)
 * 6. RewardsWardrobe: Tủ đồ & phần thưởng (#phan-thuong)
 * 7. StatsTestimonials: Số liệu & cảm nhận (chỉ hiện khi có dữ liệu)
 * 8. AboutMissionTeam: Sứ mệnh & đội ngũ rút gọn (#ve-chung-toi)
 * 9. CtaSection: Kêu gọi hành động cuối trang (#tham-gia)
 */
function AboutSections() {
  return (
    <div className="landing-content">
      <GameCardsFan />
      <TrustBar />
      <BenefitsSection />
      <GamesShowcase />
      <HowItWorks />
      <RewardsWardrobe />
      <StatsTestimonials />
      <AboutMissionTeam />
      <CtaSection />
    </div>
  );
}

export { AboutSections };
