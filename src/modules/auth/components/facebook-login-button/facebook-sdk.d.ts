interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  grantedScopes?: string;
  reauthorize_required_in?: number;
}

interface FacebookLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: FacebookAuthResponse | null;
}

interface FacebookInitParams {
  appId: string;
  cookie?: boolean;
  xfbml?: boolean;
  version: string;
}

interface FacebookLoginOptions {
  scope?: string;
  return_scopes?: boolean;
  auth_type?: string;
}

interface FacebookSDK {
  init: (params: FacebookInitParams) => void;
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options?: FacebookLoginOptions,
  ) => void;
  getLoginStatus: (
    callback: (response: FacebookLoginResponse) => void,
    roundtrip?: boolean,
  ) => void;
}

declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export type {
  FacebookAuthResponse,
  FacebookLoginResponse,
  FacebookInitParams,
  FacebookLoginOptions,
  FacebookSDK,
};

