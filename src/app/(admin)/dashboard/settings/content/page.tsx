import { getSiteSettings } from "@/data-access/settings";
import ContentForm from "@/components/admin/settings/ContentForm";
import { ContentSettingsValues } from "@/lib/validation/settings-schemas";

export default async function ContentSettingsPage() {
    const data = await getSiteSettings("content_settings");

    return (
        <div className="max-w-4xl">
            <h2 className="text-xl font-semibold text-white mb-6">Website Content</h2>
            <ContentForm initialData={data as ContentSettingsValues | undefined} />
        </div>
    );
}
