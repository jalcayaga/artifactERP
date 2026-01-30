import React from "react";

interface RoleMatrixProps {
  // Define props for role matrix, e.g., roles, permissions
}

const RoleMatrix: React.FC<RoleMatrixProps> = () => {
  const roles = ["Administrador", "Editor", "Visualizador"];
  const permissions = ["users:read", "users:update", "products:read", "products:create"];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Matriz de Roles y Permisos</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permiso</th>
            {roles.map((role) => (
              <th key={role} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permissions.map((permission) => (
            <tr key={permission}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{permission}</td>
              {roles.map((role) => (
                <td key={`${role}-${permission}`} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {/* Placeholder for checkbox or icon */}
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-brand rounded" defaultChecked={Math.random() > 0.5} />
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
