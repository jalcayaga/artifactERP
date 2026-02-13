'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@artifact/core';
import { Input } from './input';
import { Button } from './button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  title?: string;
  description?: string;
  filterColumn?: string;
  filterPlaceholder?: string;
  renderActions?: React.ReactNode;
  hidePagination?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  cardClassName?: string;
}

export function DataTable<TData>({
  columns,
  data,
  title,
  description,
  filterColumn = 'name',
  filterPlaceholder = 'Buscar...',
  renderActions,
  hidePagination = false,
  emptyState,
  className,
  cardClassName,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  const filter = table.getColumn(filterColumn);

  return (
    <div className={cn("w-full flex flex-col gap-4 animate-in fade-in duration-500", className)}>
      {(title || description || filter || renderActions) && (
        <div className="flex flex-col gap-4 px-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {(title || description) && (
              <div>
                {title && (
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-blue-gray-200 mt-1 font-normal opacity-70">
                    {description}
                  </p>
                )}
              </div>
            )}
            {renderActions && (
              <div className="flex shrink-0 gap-2">
                {renderActions}
              </div>
            )}
          </div>

          {(filter || renderActions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              <div className="relative w-full sm:max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-gray-400 opacity-50" />
                <Input
                  placeholder={filterPlaceholder}
                  value={(filter?.getFilterValue() as string) ?? ''}
                  onChange={(event) => filter?.setFilterValue(event.target.value)}
                  className="pl-10 bg-white/5 border-blue-gray-100/10 focus:border-blue-500/50 text-white placeholder:text-blue-gray-400 h-10 transition-all rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className={cn(
        "rounded-2xl border border-blue-gray-100/5 bg-[#1e293b]/50 backdrop-blur-sm overflow-hidden",
        cardClassName
      )}>
        <Table>
          <TableHeader className="bg-white/[0.02]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-blue-gray-100/5 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-blue-gray-200 font-bold text-xs uppercase tracking-wider py-4 opacity-70"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-blue-gray-100/5 hover:bg-white/[0.03] transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-white font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-blue-gray-300 italic opacity-50">
                  {emptyState ?? 'No se encontraron resultados.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!hidePagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <p className="text-sm text-blue-gray-200 opacity-60">
            Mostrando <span className="text-white font-semibold">{table.getRowModel().rows.length}</span> de <span className="text-white font-semibold">{data.length}</span> resultados
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-white/5 border-blue-gray-100/10 text-white disabled:opacity-30 rounded-lg flex items-center gap-1"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <div className="flex items-center gap-1 mx-2">
              <span className="text-sm text-blue-gray-200">Página</span>
              <span className="text-sm text-white font-bold">{table.getState().pagination.pageIndex + 1}</span>
              <span className="text-sm text-blue-gray-200">de</span>
              <span className="text-sm text-white font-bold">{table.getPageCount()}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-white/5 border-blue-gray-100/10 text-white disabled:opacity-30 rounded-lg flex items-center gap-1"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
