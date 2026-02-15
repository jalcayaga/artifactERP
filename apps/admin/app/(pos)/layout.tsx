export default function PosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <main className="h-screen w-full flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}
