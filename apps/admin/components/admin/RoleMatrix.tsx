import React from "react";

interface RoleMatrixProps {
  // Define props for role matrix, e.g., roles, permissions
}

const RoleMatrix: React.FC<RoleMatrixProps> = () => {
  const roles = ["Administrador", "Editor", "Visualizador"];
  const permissions = ["users:read", "users:update", "products:read", "products:create"];

  return (
    <div className="overflow-x-auto card-premium p-4">
      <h2 className="text-xl font-bold mb-4 text-[rgb(var(--text-primary))]">Matriz de Roles y Permisos</h2>
      <table className="min-w-full divide-y divide-[rgba(var(--border-color),0.1)]">
        <thead className="bg-[rgba(var(--bg-secondary),0.5)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">Permiso</th>
            {roles.map((role) => (
              <th key={role} className="px-6 py-3 text-center text-xs font-medium text-[rgb(var(--text-secondary))] uppercase tracking-wider">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(var(--border-color),0.1)]">
          {permissions.map((permission) => (
            <tr key={permission} className="hover:bg-[rgba(var(--brand-color),0.05)] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[rgb(var(--text-primary))]">{permission}</td>
              {roles.map((role) => (
                <td key={`${role}-${permission}`} className="px-6 py-4 whitespace-nowrap text-center text-sm text-[rgb(var(--text-secondary))]">
                  {/* Placeholder for checkbox or icon */}
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[rgb(var(--brand-color))] rounded border-[rgba(var(--border-color),0.3)] bg-transparent" defaultChecked={Math.random() > 0.5} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleMatrix;
