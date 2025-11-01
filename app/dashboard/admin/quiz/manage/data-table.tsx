"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Trash2, Globe, EyeOff, Lock, Unlock } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onToggleVisibility?: (id: string, isPublic: boolean) => void;
  onToggleAccess?: (id: string, free: boolean) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkUpdateVisibility?: (ids: string[], isPublic: boolean) => void;
  onBulkUpdateAccess?: (ids: string[], free: boolean) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleAccess,
  onBulkDelete,
  onBulkUpdateVisibility,
  onBulkUpdateAccess,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onView,
      onEdit,
      onDelete,
      onDuplicate,
      onToggleVisibility,
      onToggleAccess,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => (row.original as any).id);

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search quizzes..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* Difficulty Filter */}
          <Select
            value={
              (table.getColumn("level")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("level")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="BEGINER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>

          {/* Access Filter */}
          <Select
            value={
              (table.getColumn("free")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) => {
              const filterValue =
                value === "all" ? "" : value === "free" ? true : false;
              table.getColumn("free")?.setFilterValue(filterValue);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Access</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          {/* Visibility Filter */}
          <Select
            value={
              (table.getColumn("isPublic")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) => {
              const filterValue =
                value === "all" ? "" : value === "public" ? true : false;
              table.getColumn("isPublic")?.setFilterValue(filterValue);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkUpdateVisibility?.(selectedIds, true)}
            >
              <Globe className="h-4 w-4 mr-2" />
              Make Public
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkUpdateVisibility?.(selectedIds, false)}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Make Private
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkUpdateAccess?.(selectedIds, true)}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Make Free
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkUpdateAccess?.(selectedIds, false)}
            >
              <Lock className="h-4 w-4 mr-2" />
              Make Premium
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onBulkDelete?.(selectedIds)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No quizzes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              &lt;
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
