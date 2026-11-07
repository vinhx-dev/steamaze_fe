"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import "./facebook-sdk.d";

interface FacebookLoginButtonProps {
  mode: "login" | "register";
  onAccessToken: (accessToken: string) => void | Promise<void>;
  disabled?: boolean;
}

// Cờ kiểm tra FB.init đã chạy thành công chưa (chống StrictMode gọi lại nhiều lần)
let isFbInitialized = false;

function initFacebookSdk(appId: string) {
  if (isFbInitialized || typeof window === "undefined" || !window.FB) return;
  try {
    window.FB.init({
      appId,
      cookie: false,
      xfbml: false,
      version: "v21.0",
    });
    isFbInitialized = true;
  } catch (err) {
    console.warn("[facebook-login] Lỗi khởi tạo Facebook SDK:", err);
  }
}

// Logo "f" nhận diện chính thức của Facebook
function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FacebookLoginButton({ mode, onAccessToken, disabled = false }: FacebookLoginButtonProps) {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const onAccessTokenRef = useRef(onAccessToken);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    onAccessTokenRef.current = onAccessToken;
    disabledRef.current = disabled;
  }, [onAccessToken, disabled]);

  const handleInit = useCallback(() => {
    if (!appId) return;
    initFacebookSdk(appId);
  }, [appId]);

  useEffect(() => {
    if (typeof window === "undefined" || !appId) return;

    // Gán hàm callback fbAsyncInit theo chuẩn Facebook SDK
    window.fbAsyncInit = () => {
      initFacebookSdk(appId);
    };

    // Nếu SDK đã nạp từ trước đó
    if (window.FB && !isFbInitialized) {
      initFacebookSdk(appId);
    }
  }, [appId]);

  const handleClick = () => {
    if (disabledRef.current) return;

    if (typeof window === "undefined" || !window.FB) {
      console.warn("[facebook-login] Facebook SDK chưa sẵn sàng, vui lòng thử lại sau vài giây.");
      return;
    }

    if (!isFbInitialized && appId) {
      initFacebookSdk(appId);
    }

    window.FB.login(
      (response) => {
        // Chỉ xử lý khi người dùng đồng ý và nhận được accessToken
        if (response && response.authResponse && response.authResponse.accessToken) {
          void onAccessTokenRef.current(response.authResponse.accessToken);
        }
      },
      { scope: "public_profile" },
    );
  };

  // Không có NEXT_PUBLIC_FACEBOOK_APP_ID thì không hiện nút, không báo lỗi
  if (!appId) {
    return null;
  }

  const label = mode === "register" ? "Đăng ký với Facebook" : "Đăng nhập với Facebook";
  // Hai nút nằm chung một hàng nên chữ trên nút chỉ ghi ngắn, tên đầy đủ để ở aria-label
  const shortLabel = "Facebook";

  return (
    <>
      <Script
        id="facebook-jssdk"
        src="https://connect.facebook.net/vi_VN/sdk.js"
        strategy="afterInteractive"
        onReady={handleInit}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`facebook-btn${disabled ? " is-disabled" : ""}`}
        aria-label={label}
      >
        <span className="facebook-btn__face">
          <span className="facebook-btn__logo">
            <FacebookLogo />
          </span>
          <span className="facebook-btn__text">{shortLabel}</span>
        </span>
      </button>
    </>
  );
}

export { FacebookLoginButton };
export type { FacebookLoginButtonProps };

