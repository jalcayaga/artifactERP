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
  isLoading?: boolean;
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
  isLoading = false,
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
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-slate-400 mt-1 font-normal">
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
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder={filterPlaceholder}
                  value={(filter?.getFilterValue() as string) ?? ''}
                  onChange={(event) => filter?.setFilterValue(event.target.value)}
                  className="pl-10 bg-[#1e293b]/30 border-white/[0.08] focus:border-[#5d87ff]/50 text-white placeholder:text-slate-500 h-11 transition-all rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "rounded-[16px] bg-[#1a2537] border border-white/[0.05] overflow-hidden",
          cardClassName
        )}
        style={{
          boxShadow: "rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px"
        }}
      >
        <Table>
          <TableHeader className="bg-white/[0.01]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/[0.05] hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-slate-400 font-bold text-[12px] uppercase tracking-wider py-4"
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-blue-gray-100/5">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="py-4">
                      <div className="h-5 bg-white/5 rounded-lg animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-white/[0.05] hover:bg-white/[0.02] transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-slate-200 font-medium text-[14px]">
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
