interface GoogleIdCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleIdInitializeConfig {
  client_id: string;
  callback: (response: GoogleIdCredentialResponse) => void;
  ux_mode?: "popup" | "redirect";
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleIdRenderButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number | string;
  locale?: string;
}

interface GoogleAccountsId {
  initialize: (config: GoogleIdInitializeConfig) => void;
  renderButton: (parent: HTMLElement, options: GoogleIdRenderButtonOptions) => void;
  prompt?: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleNamespace {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google?: GoogleNamespace;
  }
}

export type {
  GoogleIdCredentialResponse,
  GoogleIdInitializeConfig,
  GoogleIdRenderButtonOptions,
  GoogleAccountsId,
  GoogleAccounts,
  GoogleNamespace,
};

