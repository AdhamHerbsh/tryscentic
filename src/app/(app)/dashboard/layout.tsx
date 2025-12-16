

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
