"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/admin";
import { User } from "@/lib/types";
import Table from "@/components/admin/Table";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  IconButton
} from "@material-tailwind/react";
import Can from "@/components/admin/Can";
import { useState } from "react";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getUsers({ page, search }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
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
    <div className="mt-4 mb-8 flex flex-col gap-12">
      <Card className="h-full w-full bg-[#1e293b] shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent px-6 pt-6 pb-2">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="white" className="font-bold">
                Gestión de Usuarios
              </Typography>
              <Typography color="gray" className="mt-1 font-normal text-blue-gray-200">
                Ver información de todos los usuarios
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3 bg-blue-500" size="sm">
                <span className="text-sm">Añadir Usuario</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Buscar"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                color="white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-[200px]",
                }}
                crossOrigin={undefined}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-hidden px-0">
          {users.length === 0 ? (
            <div className="text-center p-8">
              <Typography color="white">No se encontraron usuarios.</Typography>
            </div>
          ) : (
            <Table
              data={users}
              columns={columns}
              renderRowActions={(user) => (
                <div className="flex gap-2">
                  <Can need={["users:update"]}>
                    <IconButton variant="text" color="blue" onClick={() => handleEdit(user)}>
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                  </Can>
                  <Can need={["users:update"]}>
                    <IconButton variant="text" color="red" onClick={() => handleDeactivate(user)}>
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </Can>
                </div>
              )}
            />
          )}
        </CardBody>
        <div className="flex items-center justify-center border-t border-blue-gray-100/5 p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="text"
              size="sm"
              className="flex items-center gap-2 text-white"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              <Typography color="white" className="font-normal">
                Página <strong className="text-blue-500">{page}</strong> de <strong className="text-blue-500">{totalPages}</strong>
              </Typography>
            </div>
            <Button
              variant="text"
              size="sm"
              className="flex items-center gap-2 text-white"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
