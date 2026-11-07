"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import type { GoogleIdCredentialResponse } from "./google-identity";

interface GoogleLoginButtonProps {
  mode: "login" | "register";
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
}

// Giữ cờ khởi tạo GIS một lần duy nhất cho toàn bộ vòng đời trang (tránh StrictMode gọi 2 lần)
let isGsiInitialized = false;
let globalCredentialHandler: ((response: GoogleIdCredentialResponse) => void) | null = null;

// Logo chữ G nhiều màu theo nhận diện của Google
function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function GoogleLoginButton({ mode, onCredential, disabled = false }: GoogleLoginButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gisRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const disabledRef = useRef(disabled);

  // Cập nhật ref và callback toàn cục trỏ về handler của instance hiện tại
  useEffect(() => {
    onCredentialRef.current = onCredential;
    disabledRef.current = disabled;
    globalCredentialHandler = (response: GoogleIdCredentialResponse) => {
      if (disabledRef.current) return;
      if (response && typeof response.credential === "string" && response.credential) {
        void onCredentialRef.current(response.credential);
      }
    };

    return () => {
      globalCredentialHandler = null;
    };
  }, [onCredential, disabled]);

  // Kéo giãn nút Google thật (trong suốt) cho phủ kín nút giao diện, để bấm chỗ nào cũng trúng
  const fitOverlay = useCallback(() => {
    const wrap = wrapperRef.current;
    const gis = gisRef.current;
    const inner = gis?.firstElementChild as HTMLElement | null;
    if (!wrap || !gis || !inner || !inner.offsetWidth || !inner.offsetHeight) return;
    const sx = wrap.clientWidth / inner.offsetWidth;
    const sy = wrap.clientHeight / inner.offsetHeight;
    gis.style.transform = `scale(${sx}, ${sy})`;
  }, []);

  const renderGoogleButton = useCallback(() => {
    const gis = gisRef.current;
    if (!clientId || typeof window === "undefined" || !window.google?.accounts?.id || !gis || !wrapperRef.current) {
      return;
    }

    // Khởi tạo một lần duy nhất cho toàn trang
    if (!isGsiInitialized) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleIdCredentialResponse) => {
          if (globalCredentialHandler) {
            globalCredentialHandler(response);
          }
        },
        ux_mode: "popup",
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      isGsiInitialized = true;
    }

    // Google chỉ cho bề rộng 200..400px, phần còn thiếu được kéo giãn bằng fitOverlay
    const buttonWidth = Math.min(Math.max(wrapperRef.current.clientWidth || 360, 200), 400);

    gis.innerHTML = "";
    gis.style.transform = "";
    window.google.accounts.id.renderButton(gis, {
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: mode === "register" ? "signup_with" : "signin_with",
      locale: "vi",
      width: buttonWidth,
    });
    fitOverlay();
  }, [clientId, mode, fitOverlay]);

  // Vẽ lại nút khi script đã sẵn sàng hoặc khi mode thay đổi
  useEffect(() => {
    renderGoogleButton();
  }, [renderGoogleButton]);

  // Nút Google thật nạp chậm hoặc khung đổi cỡ (xoay màn hình) thì căn phủ lại
  useEffect(() => {
    const wrap = wrapperRef.current;
    const gis = gisRef.current;
    if (!wrap || !gis || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => fitOverlay());
    ro.observe(wrap);
    const mo = new MutationObserver(() => {
      const inner = gis.firstElementChild;
      if (inner) ro.observe(inner);
      fitOverlay();
    });
    mo.observe(gis, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [fitOverlay]);

  // Không có NEXT_PUBLIC_GOOGLE_CLIENT_ID thì không hiện nút, không báo lỗi
  if (!clientId) {
    return null;
  }

  // Hai nút nằm chung một hàng nên chữ trên nút chỉ ghi ngắn
  const label = "Google";

  return (
    <>
      <Script
        id="google-identity-services"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={renderGoogleButton}
      />
      <div ref={wrapperRef} className={`google-btn${disabled ? " is-disabled" : ""}`}>
        {/* Phần nhìn thấy: nút theo phong cách trang web */}
        <span className="google-btn__face" aria-hidden="true">
          <span className="google-btn__logo">
            <GoogleLogo />
          </span>
          <span className="google-btn__text">{label}</span>
        </span>
        {/* Nút Google thật, trong suốt, phủ lên trên để nhận cú bấm */}
        <div ref={gisRef} className="google-btn__gis" />
      </div>
    </>
  );
}

export { GoogleLoginButton };
export type { GoogleLoginButtonProps };
