"use client";

import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "@/lib/admin";
import { Company } from "@/lib/types";
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
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function SuppliersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["suppliers", page, search],
        queryFn: () => getSuppliers({ page, search }),
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
                <p>Error al cargar proveedores: {error?.message}</p>
            </div>
        );
    }

    const suppliers = data?.data || [];
    const totalPages = data?.pages || 1;

    const columns: { key: keyof Company; header: string }[] = [
        { key: "name", header: "Razón Social" },
        { key: "rut", header: "RUT" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Teléfono" },
    ];

    const handleEdit = (supplier: Company) => {
        alert(`Editar proveedor: ${supplier.name}`);
    };

    const handleRemove = (supplier: Company) => {
        alert(`Eliminar proveedor: ${supplier.name}`);
    };

    return (
        <div className="mt-4 mb-8 flex flex-col gap-12">
            <Card
                className="h-full w-full bg-[#1e293b] shadow-none border border-blue-gray-100/5"
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
            >
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none bg-transparent px-6 pt-6 pb-2"
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography
                                variant="h5"
                                color="white"
                                className="font-bold"
                                placeholder=""
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >
                                Gestión de Proveedores
                            </Typography>
                            <Typography
                                color="gray"
                                className="mt-1 font-normal text-blue-gray-200"
                                placeholder=""
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >
                                Administra la red de proveedores de tu empresa
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button
                                className="flex items-center gap-3 bg-blue-500"
                                size="sm"
                                placeholder=""
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span className="text-sm">Nuevo Proveedor</span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="w-full md:w-72">
                            <Input
                                label="Buscar por nombre o RUT"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                color="white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="!border-t-blue-gray-200 focus:!border-t-white"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                crossOrigin={undefined}
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody
                    className="overflow-hidden px-0"
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    {suppliers.length === 0 ? (
                        <div className="text-center p-8">
                            <Typography
                                color="white"
                                placeholder=""
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >No se encontraron proveedores.</Typography>
                        </div>
                    ) : (
                        <Table
                            data={suppliers}
                            columns={columns}
                            renderRowActions={(supplier) => (
                                <div className="flex gap-2">
                                    <Can need={["companies:update"]}>
                                        <IconButton
                                            variant="text"
                                            color="blue"
                                            onClick={() => handleEdit(supplier)}
                                            placeholder=""
                                            onPointerEnterCapture={() => { }}
                                            onPointerLeaveCapture={() => { }}
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Can>
                                    <Can need={["companies:delete"]}>
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            onClick={() => handleRemove(supplier)}
                                            placeholder=""
                                            onPointerEnterCapture={() => { }}
                                            onPointerLeaveCapture={() => { }}
                                        >
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
                            placeholder=""
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        >
                            Anterior
                        </Button>
                        <div className="flex items-center gap-2">
                            <Typography
                                color="white"
                                className="font-normal"
                                placeholder=""
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                            >
                                Página <strong className="text-blue-500">{page}</strong> de <strong className="text-blue-500">{totalPages}</strong>
                            </Typography>
                        </div>
                        <Button
                            variant="text"
                            size="sm"
                            className="flex items-center gap-2 text-white"
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            placeholder=""
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
