import "./trust-bar.scss";

function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Thông tin tài trợ và tính năng an toàn">
      <div className="trust-bar__inner">
        {/* Phần nhà tài trợ */}
        <div className="trust-bar__sponsor">
          <span className="trust-bar__sponsor-label">ĐƯỢC TÀI TRỢ BỞI:</span>
          <div className="trust-bar__sponsor-names">
            <strong>UN Women Việt Nam</strong>
            <span className="trust-bar__dot">·</span>
            <strong>GenAct</strong>
            <span className="trust-bar__dot">·</span>
            <strong>TUVA Communication</strong>
          </div>
        </div>

        <div className="trust-bar__divider" aria-hidden="true" />

        {/* 3 huy hiệu tin cậy */}
        <div className="trust-bar__badges">
          <span className="trust-bar__badge">
            <span className="trust-bar__badge-icon">🆓</span>
            <span>Miễn phí 100%</span>
          </span>
          <span className="trust-bar__badge">
            <span className="trust-bar__badge-icon">🔒</span>
            <span>Camera xử lý ngay trên máy</span>
          </span>
          <span className="trust-bar__badge">
            <span className="trust-bar__badge-icon">📱</span>
            <span>Chơi được trên điện thoại & máy tính</span>
          </span>
        </div>
      </div>
    </section>
  );
}

export { TrustBar };

