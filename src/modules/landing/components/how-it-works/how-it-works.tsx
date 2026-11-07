import { howItWorksSteps, cameraSecurityNote } from "../../data/content";
import { Reveal } from "../reveal";
import "./how-it-works.scss";

function HowItWorks() {
  return (
    <section
      className="how-it-works"
      id="cach-choi"
      aria-labelledby="how-it-works-title"
    >
      <div className="how-it-works__inner">
        <Reveal>
          <div className="how-it-works__header">
            <h2 className="how-it-works__title" id="how-it-works-title">
              Chơi thế nào? 3 bước cực dễ
            </h2>
            <p className="how-it-works__subtitle">
              Không cần cài đặt ứng dụng phức tạp. Chỉ cần mở trình duyệt lên là chơi!
            </p>
          </div>
        </Reveal>

        <div className="how-it-works__steps">
          {howItWorksSteps.map((item, index) => (
            <Reveal key={item.step} delayMs={index * 100}>
              <div className="how-it-works__step-card">
                <div className="how-it-works__badge-row">
                  <span className="how-it-works__step-num">{item.step}</span>
                  <span className="how-it-works__step-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
                <h3 className="how-it-works__step-title">{item.title}</h3>
                <p className="how-it-works__step-desc">{item.description}</p>

                {index < howItWorksSteps.length - 1 && (
                  <div className="how-it-works__connector" aria-hidden="true">
                    <span>➔</span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Hộp trấn an an toàn cho học sinh */}
        <Reveal delayMs={240}>
          <div className="how-it-works__security-box">
            <span className="how-it-works__security-icon" aria-hidden="true">
              🔒
            </span>
            <p className="how-it-works__security-text">{cameraSecurityNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { HowItWorks };

