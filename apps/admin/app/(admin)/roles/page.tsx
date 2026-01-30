import RoleMatrix from "@/components/admin/RoleMatrix";

export default function RolesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Roles y Permisos</h1>
      <RoleMatrix />
    </div>
  );
}
