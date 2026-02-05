
import ProvidersView from "@/components/providers/ProvidersView";

export default function ProvidersPage() {
    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Proveedores</h1>
                <p className="text-gray-600">Gestiona el registro de tus proveedores.</p>
            </div>

            <ProvidersView />
        </div>
    );
}
