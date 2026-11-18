"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/modules/auth";
import { ErrorState } from "@/components/ui/error-state";
import { getApiErrorMessage } from "@/utils/api-error";
import { getReferralInfo, redeemReferralCode } from "../../services/reward.service";
import type { ReferralInfo } from "../../types";
import "../daily-reward-modal/daily-reward-modal.scss";
import "./referral-modal.scss";

interface ReferralModalProps {
  onClose: () => void;
}

const REFERRAL_INFO_KEY = "referral-info";
const REFERRAL_CODE_LENGTH = 8;
const COPIED_RESET_MS = 2000;

export function ReferralModal({ onClose }: ReferralModalProps) {
  const { user, updateCoins } = useAuth();
  const queryClient = useQueryClient();
  const codeInputRef = useRef<HTMLInputElement>(null);
  const copiedTimerRef = useRef<number | undefined>(undefined);

  const [isCopied, setIsCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const queryKey = [REFERRAL_INFO_KEY, user?.id];
  const referralQuery = useQuery({
    queryKey,
    queryFn: getReferralInfo,
    enabled: Boolean(user?.id),
    staleTime: 0,
    refetchOnMount: "always",
  });
  const referral = referralQuery.data ?? null;

  async function handleCopy() {
    if (!referral) return;
    let copied = false;
    try {
      await navigator.clipboard.writeText(referral.code);
      copied = true;
    } catch {
      // Trình duyệt chặn clipboard (vd: trang http): chép từ ô đang chọn
      codeInputRef.current?.select();
      copied = document.execCommand("copy");
    }

    setCopyFailed(!copied);
    setIsCopied(copied);
    window.clearTimeout(copiedTimerRef.current);
    if (copied) {
      copiedTimerRef.current = window.setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    }
  }

  async function handleRedeem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isRedeeming || inputCode.length !== REFERRAL_CODE_LENGTH) return;

    setIsRedeeming(true);
    setRedeemError(null);

    try {
      const result = await redeemReferralCode(inputCode);
      updateCoins(result.userCoins);
      setSuccessMessage(result.message);
      queryClient.setQueryData<ReferralInfo>(queryKey, (prev) =>
        prev
          ? { ...prev, hasRedeemed: true, referredByUsername: result.referredByUsername }
          : prev,
      );
    } catch (err: unknown) {
      setRedeemError(getApiErrorMessage(err, "Không thể nhập mã lúc này. Vui lòng thử lại."));
      // Đồng bộ lại (vd: đã nhập mã ở tab khác)
      void referralQuery.refetch();
    } finally {
      setIsRedeeming(false);
    }
  }

  return (
    <div
      className="daily-reward-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="daily-reward-modal referral-modal">
        <button
          type="button"
          className="daily-reward-modal__close-btn"
          onClick={onClose}
          aria-label="Đóng bảng mã giới thiệu"
        >
          ✕
        </button>

        <div className="daily-reward-modal__header">
          <h2 id="referral-modal-title" className="daily-reward-modal__title">
            MÃ GIỚI THIỆU
          </h2>
        </div>

        {referralQuery.isError && !referral ? (
          <ErrorState
            compact
            title="Không tải được mã giới thiệu"
            message={getApiErrorMessage(referralQuery.error, "Đã xảy ra sự cố khi tải dữ liệu.")}
            isRetrying={referralQuery.isFetching}
            onRetry={() => void referralQuery.refetch()}
          />
        ) : !referral ? (
          <div className="daily-reward-modal__loading" aria-busy="true">
            <span className="daily-reward-modal__spinner" />
            Đang tải mã giới thiệu...
          </div>
        ) : (
          <>
            <section className="referral-modal__section">
              <label className="referral-modal__label" htmlFor="referral-my-code">
                Mã của bạn (bạn bè nhập mã này, cả hai cùng nhận {referral.rewardCoins} xu)
              </label>
              <div className="referral-modal__row">
                <input
                  ref={codeInputRef}
                  id="referral-my-code"
                  className="referral-modal__input referral-modal__input--code"
                  value={referral.code}
                  readOnly
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  className="daily-reward-modal__btn daily-reward-modal__btn--claim referral-modal__btn"
                  onClick={handleCopy}
                >
                  {isCopied ? "Đã chép" : "Sao chép"}
                </button>
              </div>
              {copyFailed && (
                <p className="referral-modal__hint" role="alert">
                  Không chép tự động được, hãy chọn mã và chép thủ công.
                </p>
              )}
            </section>

            <section className="referral-modal__section referral-modal__section--divided">
              {referral.hasRedeemed ? (
                <p className="referral-modal__done" role="status">
                  {successMessage ??
                    (referral.referredByUsername
                      ? `Bạn đã nhập mã của ${referral.referredByUsername}.`
                      : "Bạn đã nhập mã giới thiệu.")}
                </p>
              ) : (
                <form onSubmit={handleRedeem}>
                  <label className="referral-modal__label" htmlFor="referral-input-code">
                    Nhập mã của bạn bè để nhận {referral.rewardCoins} xu
                  </label>
                  <div className="referral-modal__row">
                    <input
                      id="referral-input-code"
                      className="referral-modal__input"
                      value={inputCode}
                      onChange={(e) => {
                        setInputCode(e.target.value.trim().toUpperCase());
                        setRedeemError(null);
                      }}
                      maxLength={REFERRAL_CODE_LENGTH}
                      placeholder="Nhập mã"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      aria-invalid={Boolean(redeemError)}
                    />
                    <button
                      type="submit"
                      className="daily-reward-modal__btn daily-reward-modal__btn--claim referral-modal__btn"
                      disabled={isRedeeming || inputCode.length !== REFERRAL_CODE_LENGTH}
                    >
                      {isRedeeming ? "Đang nhập..." : `Nhận +${referral.rewardCoins} xu`}
                    </button>
                  </div>
                </form>
              )}
              {redeemError && (
                <div className="daily-reward-modal__error" role="alert">
                  {redeemError}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
