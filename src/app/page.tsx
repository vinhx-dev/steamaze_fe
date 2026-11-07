import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { buildMetadata, buildWebApplication, buildWebSite } from "@/lib/seo";
import { LandingPage3D } from "@/modules/landing/scene-3d";

function generateMetadata(): Metadata {
  return buildMetadata(siteConfig.routes.home, siteConfig.seoText.home);
}

function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSite()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebApplication()) }}
      />
      <main>
        <LandingPage3D />
      </main>
    </>
  );
}

export default HomePage;
export { generateMetadata };
