"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, RealtimePostgresChangesPayload, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/utils/supabase/client";
import { Profile } from "@/types/database";

import { getFullProfile } from "@/data-access/user/profile";

interface UserContextType {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
    initialProfile?: Profile | null;
}

export function UserProvider({ children, initialProfile = null }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(initialProfile);
    const [isLoading, setIsLoading] = useState(!initialProfile);
    const supabase = createClient();

    const refreshProfile = async () => {
        if (user) {
            const updatedProfile = await getFullProfile(user.id);
            if (updatedProfile) {
                setProfile(updatedProfile);
            }
        }
    };

    useEffect(() => {
        let profileSubscription: any = null;

        const initializeAuth = async () => {
            // Start loading only if we define it so. If we have initialProfile, we might still want to check auth consistency
            if (!initialProfile) setIsLoading(true);

            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                // If we have initialProfile and it matches user, keep it, otherwise fetch
                if (!profile || profile.id !== authUser.id) {
                    const userProfile = await getFullProfile(authUser.id);
                    setProfile(userProfile);
                }

                // Set up Realtime listener for this user's profile
                profileSubscription = supabase
                    .channel(`profile-${authUser.id}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "UPDATE",
                            schema: "public",
                            table: "profiles",
                            filter: `id=eq.${authUser.id}`,
                        },
                        (payload: RealtimePostgresChangesPayload<Profile>) => {
                            setProfile(payload.new as Profile);
                        }
                    )
                    .subscribe();
            } else {
                setProfile(null);
            }
            setIsLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            const newUser = session?.user ?? null;

            // Only update if user actually changed to avoid unnecessary re-renders
            if (newUser?.id !== user?.id) {
                setUser(newUser);
                if (newUser) {
                    const userProfile = await getFullProfile(newUser.id);
                    setProfile(userProfile);
                } else {
                    setProfile(null);
                }
            }

            if (event === 'SIGNED_OUT') {
                setProfile(null);
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
            if (profileSubscription) {
                supabase.removeChannel(profileSubscription);
            }
        };
    }, [supabase, initialProfile]); // Remove profile from dependency to avoid loop, use ref if needed or rely on internal state

    const signOut = async () => {
        console.log("Signing out...");
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Clear all cookies to ensure session termination
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setUser(null);
            setProfile(null);
        }
    };

    return (
        <UserContext.Provider value={{ user, profile, isLoading, refreshProfile, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
