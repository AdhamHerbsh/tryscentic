import { getSiteSettings } from "@/data-access/settings";
import HeroForm from "@/components/admin/settings/HeroForm";
import { HeroSettingsValues } from "@/lib/validation/settings-schemas";

export default async function HeroSettingsPage() {
    const data = await getSiteSettings("hero_section");

    return (
        <div className="max-w-4xl">
            <h2 className="text-xl font-semibold text-white mb-6">Hero Section Configuration</h2>
            <HeroForm initialData={data as HeroSettingsValues | undefined} />
        </div>
    );
}
