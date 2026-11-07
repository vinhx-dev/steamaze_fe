import { env } from "./env";

interface SocialLink {
  platform: string;
  url: string;
}

interface PageSeoText {
  title: string;
  description: string;
  keywords?: readonly string[];
  noIndex?: boolean;
  noFollow?: boolean;
}

interface SeoText {
  home: PageSeoText;
}

const siteConfig = {
  name: env.appName,
  language: "vi",
  locale: "vi_VN",
  ogImage: {
    path: "/images/landing/scene-poster.webp",
    width: 1600,
    height: 900,
    alt: "STEAMaze - Dùng kiến thức để chinh phục mọi trò chơi",
  },
  themeColor: "#e6e3d8",
  socialLinks: [] as readonly SocialLink[],
  routes: {
    home: "/",
  },
  seoText: {
    home: {
      title: "STEAMaze - Dùng kiến thức để chinh phục mọi trò chơi",
      description:
        "Những trò chơi thú vị tương tác trực tiếp qua camera: dùng kiến thức để vượt màn, nhận quà và mặc đồ cho nhân vật. Miễn phí, chơi ngay trên trình duyệt.",
      keywords: [
        env.appName,
        "STEAMaze",
        "STEAM",
        "giáo dục STEAM",
        "học qua trò chơi",
        "trò chơi khoa học",
        "hand tracking",
        "camera AI",
        "game giáo dục",
      ],
    },
  } satisfies SeoText,
} as const;

export { siteConfig };
export type { PageSeoText, SeoText, SocialLink };
