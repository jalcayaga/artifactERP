import { Button } from '@artifact/ui'; // Será migrado
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Column, Row } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@artifact/ui'; // Será migrado
import { Company } from '@artifact/core';;

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
      cell: ({ row }: { row: Row<Company> }) => (row.original.isClient ? 'Sí' : 'No'),
    },
    {
      accessorKey: 'isSupplier',
      header: 'Proveedor',
      cell: ({ row }: { row: Row<Company> }) => (row.original.isSupplier ? 'Sí' : 'No'),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Company> }) => {
        const company = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(company)}>Ver</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(company)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(company)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
