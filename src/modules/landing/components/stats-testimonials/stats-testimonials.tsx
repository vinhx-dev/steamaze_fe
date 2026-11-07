import type { LandingStat, Testimonial } from "../../data/content";
import { landingStats, testimonials } from "../../data/content";
import { Reveal } from "../reveal";
import "./stats-testimonials.scss";

interface StatsTestimonialsProps {
  readonly stats?: readonly LandingStat[];
  readonly testimonialsList?: readonly Testimonial[];
}

/**
 * Mục 8: Số liệu & Nhận xét
 * Mặc định mảng rỗng trong data/content.ts -> Không render (trả về null).
 * Khi dự án có số liệu thực tế, chỉ cần thêm dữ liệu vào `landingStats` và `testimonials`.
 */
function StatsTestimonials({
  stats = landingStats,
  testimonialsList = testimonials,
}: StatsTestimonialsProps) {
  const hasStats = stats && stats.length > 0;
  const hasTestimonials = testimonialsList && testimonialsList.length > 0;

  if (!hasStats && !hasTestimonials) {
    return null;
  }

  return (
    <section
      className="landing-stats-testimonials"
      id="thanh-tich"
      aria-labelledby="stats-title"
    >
      <div className="landing-stats-testimonials__inner">
        <h2 id="stats-title" className="visually-hidden">
          Thành tích và cảm nhận của người chơi
        </h2>

        {hasStats && (
          <Reveal>
            <div className="landing-stats-testimonials__stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="landing-stats-testimonials__stat-card">
                  <span className="landing-stats-testimonials__stat-value">
                    {stat.value}
                  </span>
                  <span className="landing-stats-testimonials__stat-label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {hasTestimonials && (
          <Reveal delayMs={150}>
            <div className="landing-stats-testimonials__quotes-grid">
              {testimonialsList.map((item, idx) => (
                <blockquote
                  key={idx}
                  className="landing-stats-testimonials__quote-card"
                >
                  <p className="landing-stats-testimonials__quote-text">
                    “{item.quote}”
                  </p>
                  <footer className="landing-stats-testimonials__quote-author">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export { StatsTestimonials };

