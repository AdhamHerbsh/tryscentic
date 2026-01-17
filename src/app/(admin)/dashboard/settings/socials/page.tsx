import { getSiteSettings } from "@/data-access/settings";
import SocialsForm from "@/components/admin/settings/SocialsForm";
import { SocialsSettingsValues } from "@/lib/validation/settings-schemas";

export default async function SocialsSettingsPage() {
    const data = await getSiteSettings("social_settings");

    return (
        <div className="max-w-4xl">
            <h2 className="text-xl font-semibold text-white mb-6">Social Media Links</h2>
            <SocialsForm initialData={data as SocialsSettingsValues | undefined} />
        </div>
    );
}
