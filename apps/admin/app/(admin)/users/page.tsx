"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/admin";
import { User } from "@/lib/types";
import Table from "@/components/admin/Table";
import { Button } from "@artifact/ui";
import { Input } from "@artifact/ui";
import Can from "@/components/admin/Can";
import { useState } from "react";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getUsers({ page, search }),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>Error al cargar usuarios: {error?.message}</p>
      </div>
    );
  }

  const users = (data?.data || []).map((u: any) => ({
    ...u,
    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Sin Nombre',
    role: u.roles?.[0]?.name || 'N/A'
  }));
  const totalPages = data?.pages || 1;

  const columns = [
    { key: "name", header: "Nombre" },
    { key: "email", header: "Email" },
    { key: "role", header: "Rol" },
  ];

  const handleEdit = (user: User) => {
    alert(`Editar usuario: ${user.name}`);
  };

  const handleDeactivate = (user: User) => {
    alert(`Desactivar usuario: ${user.name}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button>Añadir Usuario</Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center">
          <p>No se encontraron usuarios.</p>
        </div>
      ) : (
        <Table
          data={users}
          columns={columns}
          renderRowActions={(user) => (
            <div className="flex gap-2">
              <Can need={["users:update"]}>
                <Button onClick={() => handleEdit(user)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Editar
                </Button>
              </Can>
              <Can need={["users:update"]}>
                <Button onClick={() => handleDeactivate(user)} className="bg-red-500 hover:bg-red-600 text-white">
                  Desactivar
                </Button>
              </Can>
            </div>
          )}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
