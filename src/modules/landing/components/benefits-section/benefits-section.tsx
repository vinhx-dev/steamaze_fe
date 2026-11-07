import { landingBenefits } from "../../data/content";
import { Reveal } from "../reveal";
import "./benefits-section.scss";

function BenefitsSection() {
  return (
    <section
      className="landing-benefits"
      id="loi-ich"
      aria-labelledby="benefits-title"
    >
      <div className="landing-benefits__inner">
        <Reveal>
          <div className="landing-benefits__header">
            <h2 className="landing-benefits__title" id="benefits-title">
              STEAMaze mang lại gì cho bạn?
            </h2>
            <p className="landing-benefits__subtitle">
              Không phải học thuộc lòng. Ở đây bạn chơi, thử, sai rồi thử lại,
              kiến thức tự ở lại.
            </p>
          </div>
        </Reveal>

        <div className="landing-benefits__grid">
          {landingBenefits.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 80}>
              <article className="landing-benefits__card">
                <div className="landing-benefits__icon-wrap" aria-hidden="true">
                  <span className="landing-benefits__icon">{item.icon}</span>
                </div>
                <h3 className="landing-benefits__card-title">{item.title}</h3>
                <p className="landing-benefits__card-desc">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { BenefitsSection };

