import type { Metadata } from "next";
import { cinzel, cinzelDecorative } from "@/lib/fonts";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/utils/constants";
import "@/app/globals.css";

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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="min-h-screen pt-30 p-10 flex flex-col items-center">
                <div className="mb-8">
                    <h1
                        className="text-4xl font-bold">
                        TRYSCENTIC
                    </h1>
                </div>
                {children}
            </div>
        </>
    );
}
