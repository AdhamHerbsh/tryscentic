"use client";

import { createContext, useContext, ReactNode } from "react";
import { HeroSettingsValues, ContentSettingsValues, SocialsSettingsValues } from "@/lib/validation/settings-schemas";

interface SiteSettingsState {
    hero?: HeroSettingsValues;
    content?: ContentSettingsValues;
    socials?: SocialsSettingsValues;
    // We can add other dynamic content here if needed
}

const SiteSettingsContext = createContext<SiteSettingsState | null>(null);

export function SiteSettingsProvider({
    children,
    initialSettings
}: {
    children: ReactNode;
    initialSettings: SiteSettingsState
}) {
    return (
        <SiteSettingsContext.Provider value={initialSettings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettingsContext() {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error("useSiteSettingsContext must be used within a SiteSettingsProvider");
    }
    return context;
}
