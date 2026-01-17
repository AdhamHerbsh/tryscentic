"use client";

import { useEffect, useState } from "react";
import { getAllSettingsAction } from "@/actions/settings-actions";
import {
  HeroSettingsValues,
  ContentSettingsValues,
  SocialsSettingsValues,
} from "@/lib/validation/settings-schemas";

export interface SiteSettings {
  hero?: HeroSettingsValues;
  content?: ContentSettingsValues;
  socials?: SocialsSettingsValues;
  isLoading: boolean;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({ isLoading: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAllSettingsAction();
        setSettings({
          hero: data.hero_section,
          content: data.content_settings,
          socials: data.social_settings,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
        setSettings((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchSettings();
  }, []);

  return settings;
}
