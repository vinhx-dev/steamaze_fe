"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui";
import { useAuth } from "@/modules/auth";
import { landing3DContent as C } from "../data/content";
import { PlayButton } from "./play-button";

export interface OverlaySectionsProps {
  activeStopIndex: number;
  onGoTo: (index: number) => void;
}

const SUPPORT_URL = "https://www.facebook.com/profile.php?id=61595040895107";

/**
 * Lớp chữ HTML trên cảnh 3D: không dùng hộp/khung, chữ trắng đặt trên lớp phủ tối mờ (landing-3d__scrim) để luôn đọc rõ.
 * Mỗi chặng cao đúng 1 màn hình, khớp với điểm dừng của camera.
 */
export function OverlaySections({ activeStopIndex, onGoTo }: OverlaySectionsProps) {
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();
  const on = (i: number) => (activeStopIndex === i ? " is-active" : "");

  // Menu xổ xuống trên điện thoại (máy tính luôn hiện đủ các mục)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeMenu = () => setIsMenuOpen(false);

  // Đang mở menu: bấm ra ngoài hoặc nhấn Escape thì đóng
  useEffect(() => {
    if (!isMenuOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="stages">
      {/* Thanh điều hướng */}
      <header className="topbar">
        <nav ref={navRef} className="topbar__nav" aria-label="Điều hướng chính">
          <div id="topbar-menu" className={`topbar__links${isMenuOpen ? " is-open" : ""}`}>
            <Link href="/" className="topbar__drawer-brand" aria-label="STEAMaze - Trang chủ" onClick={closeMenu}>
              <BrandLogo />
            </Link>
            <button
              type="button"
              className="topbar__link"
              onClick={() => {
                closeMenu();
                onGoTo(1);
              }}
            >
              Trò chơi
            </button>
            <Link href="/tin-tuc" className="topbar__link" onClick={closeMenu}>
              Tin tức
            </Link>
            <Link href="/fanpage" className="topbar__link" onClick={closeMenu}>
              Fanpage
            </Link>
          </div>
          <Link href={isAuthenticated ? "/lessons" : "/login?next=/lessons"} className="topbar__login">
            {isAuthenticated ? "Vào học" : "Đăng nhập"}
          </Link>
          {/* Lớp tối phía sau thanh menu trái, bấm vào để đóng (chỉ có trên điện thoại) */}
          <div
            className={`topbar__backdrop${isMenuOpen ? " is-open" : ""}`}
            aria-hidden="true"
            onClick={closeMenu}
          />
          {/* Nút ba gạch, chỉ hiện trên điện thoại */}
          <button
            type="button"
            className={`topbar__toggle${isMenuOpen ? " is-open" : ""}`}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMenuOpen}
            aria-controls="topbar-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Chặng 0: hero */}
      <section className={`stage stage--hero${on(0)}`} aria-labelledby="hero-title">
        <div className="stage__text">
          <Link href="/" className="stage__brand" aria-label="STEAMaze - Trang chủ">
            <BrandLogo size="lg" />
          </Link>
          <h1 id="hero-title" className="stage__title stage__title--xl">
            {C.hero.title}
          </h1>
          <p className="stage__lead">{C.hero.subtitle}</p>
          <div className="stage__actions">
            <PlayButton size="large" text={C.hero.ctaPlay} arrow={false} />
            <button type="button" className="btn-ghost" onClick={() => onGoTo(1)}>
              {C.hero.ctaExplore}
              <span aria-hidden="true"> ↓</span>
            </button>
          </div>
        </div>
        <button type="button" className="scroll-cue" onClick={() => onGoTo(1)}>
          <span className="scroll-cue__mouse" aria-hidden="true" />
          {C.hero.scrollHint}
        </button>
      </section>

      {/* Chặng 1–3: ba trò chơi */}
      {C.games.map((g, i) => (
        <section key={g.id} id={g.id} className={`stage stage--side${on(i + 1)}`} aria-labelledby={`${g.id}-title`}>
          <div className="stage__text">
            <h2 id={`${g.id}-title`} className="stage__title">
              {g.title}
            </h2>
            <p className="stage__lead">{g.description}</p>
            <ul className="stage__list" aria-label="Bạn sẽ học được">
              {g.learnings.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <div className="stage__actions">
              <PlayButton text="Chơi thử" />
            </div>
          </div>
        </section>
      ))}

      {/* Chặng 4: tủ đồ */}
      <section className={`stage stage--side${on(4)}`} aria-labelledby="wardrobe-title">
        <div className="stage__text">
          <h2 id="wardrobe-title" className="stage__title">
            {C.wardrobe.title}
          </h2>
          <p className="stage__lead">{C.wardrobe.description}</p>
          <ol className="stage__steps">
            {C.wardrobe.steps.map((s) => (
              <li key={s.step}>
                <span className="stage__step-num">{s.step}</span>
                <span>
                  <strong>{s.title}</strong> — {s.desc}
                </span>
              </li>
            ))}
          </ol>
          <div className="stage__actions">
            <PlayButton text={C.wardrobe.cta} />
          </div>
        </div>
      </section>

      {/* Chặng 5: bạn bè & thầy cô */}
      <section className={`stage stage--side${on(5)}`} aria-labelledby="community-title">
        <div className="stage__text">
          <h2 id="community-title" className="stage__title">
            {C.community.friends.title}
          </h2>
          <p className="stage__lead">{C.community.friends.description}</p>
          <div className="stage__divider" aria-hidden="true" />
          <h3 className="stage__subtitle">{C.community.teachers.title}</h3>
          <p className="stage__body">{C.community.teachers.description}</p>
        </div>
      </section>

      {/* Chặng 6: đích đến + chân trang */}
      <section className={`stage stage--center${on(6)}`} aria-labelledby="finale-title">
        <div className="stage__text">
          <h2 id="finale-title" className="stage__title stage__title--xl">
            {C.finale.title}
          </h2>
          <p className="stage__lead">{C.finale.subtitle}</p>
          <div className="stage__actions">
            <PlayButton size="large" text={C.finale.ctaPlay} arrow={false} />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <nav className="site-footer__nav" aria-label="Liên kết chân trang">
          <Link href="/">Trang chủ</Link>
          <Link href="/tin-tuc">Tin tức</Link>
          <Link href="/fanpage">Fanpage</Link>
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
            Hỗ trợ
          </a>
          {/* TODO: thêm link Chính sách quyền riêng tư khi trang đó được tạo (bắt buộc cho Google OAuth và vì người dùng là học sinh) */}
        </nav>
        <p className="site-footer__credit">{C.finale.credit}</p>
        <p className="site-footer__copy">© {year} STEAMaze. Mọi quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
