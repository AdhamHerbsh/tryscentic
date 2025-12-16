import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function DashboardPage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    return (
        <div>
            <h1>Dashboard</h1>

            {user ? (
                <div>
                    <h2>Kinde Auth User Data:</h2>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading user data or not authenticated...</p>
            )}
        </div>
    );
}
