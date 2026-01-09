"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/utils/supabase/client";
import { Profile } from "@/types/database";

interface UserContextType {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                return null;
            }
            return data as Profile;
        } catch (err) {
            console.error("Unexpected error fetching profile:", err);
            return null;
        }
    };

    const refreshProfile = async () => {
        if (user) {
            const updatedProfile = await fetchProfile(user.id);
            setProfile(updatedProfile);
        }
    };

    useEffect(() => {
        let profileSubscription: any = null;

        const initializeAuth = async () => {
            setIsLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                const userProfile = await fetchProfile(authUser.id);
                setProfile(userProfile);

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
                        (payload) => {
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

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);

            if (newUser) {
                const userProfile = await fetchProfile(newUser.id);
                setProfile(userProfile);

                // Re-subscribe to Realtime if user changed or logged in
                if (profileSubscription) {
                    supabase.removeChannel(profileSubscription);
                }
                profileSubscription = supabase
                    .channel(`profile-${newUser.id}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "UPDATE",
                            schema: "public",
                            table: "profiles",
                            filter: `id=eq.${newUser.id}`,
                        },
                        (payload) => {
                            setProfile(payload.new as Profile);
                        }
                    )
                    .subscribe();
            } else {
                setProfile(null);
                if (profileSubscription) {
                    supabase.removeChannel(profileSubscription);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            if (profileSubscription) {
                supabase.removeChannel(profileSubscription);
            }
        };
    }, [supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
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
