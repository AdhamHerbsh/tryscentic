import type { Metadata } from "next";
import { cinzel, cinzelDecorative } from "@/lib/fonts";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/utils/constants";
import { Toaster } from 'sonner';
import { UserProvider } from "@/lib/context/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "perfume",
    "fragrance",
    "authentic perfumes",
    "perfume samples",
    "luxury perfumes",
    "designer fragrances",
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

import { getAllSiteSettings } from "@/data-access/settings";
import { SiteSettingsProvider } from "@/providers/SiteSettingsProvider";
import { getServerFullProfile } from "@/actions/profile-actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settingsData, userProfile] = await Promise.all([
    getAllSiteSettings(),
    getServerFullProfile(),
  ]);

  const initialSettings = {
    hero: settingsData.hero_section,
    content: settingsData.content_settings,
    socials: settingsData.social_settings,
  };

  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${cinzelDecorative.variable} antialiased bg-primary`}
        suppressHydrationWarning
      >
        <UserProvider initialProfile={userProfile}>
          <SiteSettingsProvider initialSettings={initialSettings}>
            {children}
            <Toaster position="bottom-center" richColors />
          </SiteSettingsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
