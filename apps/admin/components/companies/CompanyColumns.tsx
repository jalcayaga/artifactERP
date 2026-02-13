import { Button } from '@artifact/ui';
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { Column, Row } from '@tanstack/react-table';
import { Company } from '@artifact/core';
import { IconButton, Tooltip } from "@material-tailwind/react";

// Esta función se llamará desde CompanyView para pasar los manejadores de eventos
export const getColumns = (
  handleEdit: (company: Company) => void,
  handleDelete: (company: Company) => void,
  handleView: (company: Company) => void,
  viewType: 'my-companies' | 'all-companies' = 'all-companies'
) => {
  const allColumns = [
    {
      accessorKey: 'name',
      header: ({ column }: { column: Column<Company> }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent text-blue-gray-200 font-bold"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
    },
    {
      accessorKey: 'isClient',
      header: 'Cliente',
      cell: ({ row }: { row: Row<Company> }) => (
        <span className={row.original.isClient ? "text-green-400 font-bold" : "text-blue-gray-400 opacity-50"}>
          {row.original.isClient ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'isSupplier',
      header: 'Proveedor',
      cell: ({ row }: { row: Row<Company> }) => (
        <span className={row.original.isSupplier ? "text-blue-400 font-bold" : "text-blue-gray-400 opacity-50"}>
          {row.original.isSupplier ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Company> }) => {
        const company = row.original;
        return (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Tooltip content="Ver detalles">
              <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={() => handleView(company)}
                className="hover:bg-blue-500/10"
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
              >
                <Eye className="h-4 w-4 text-blue-gray-200" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Editar">
              <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={() => handleEdit(company)}
                className="hover:bg-blue-500/10"
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
              >
                <Pencil className="h-4 w-4 text-blue-500" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Eliminar">
              <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={() => handleDelete(company)}
                className="hover:bg-red-500/10"
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (viewType === 'my-companies') {
    return allColumns.filter(
      (col) => col.accessorKey !== 'isClient' && col.accessorKey !== 'isSupplier'
    );
  }

  return allColumns;
};
