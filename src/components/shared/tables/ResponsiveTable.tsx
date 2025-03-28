
import React, { memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (props: { row: { original: T; getValue: (key: string) => any } }) => React.ReactNode;
  className?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  noResultsMessage?: string;
  onRowClick?: (row: T) => void;
  keyExtractor: (item: T) => string;
}

// Memoized row component for better performance
const MemoizedTableRow = memo(<T extends unknown>({ 
  row, 
  columns, 
  keyExtractor, 
  onRowClick 
}: { 
  row: T; 
  columns: Column<T>[]; 
  keyExtractor: (item: T) => string; 
  onRowClick?: (row: T) => void;
}) => (
  <TableRow
    key={keyExtractor(row)}
    className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
    onClick={() => onRowClick && onRowClick(row)}
  >
    {columns.map((column) => (
      <TableCell key={`${keyExtractor(row)}-${String(column.accessorKey)}`} className={column.className}>
        {column.cell
          ? column.cell({
              row: {
                original: row,
                getValue: (key: string) => {
                  // Handle nested keys like "user.name"
                  if (key.includes('.')) {
                    return key.split('.').reduce((obj, key) => obj && obj[key as keyof typeof obj], row as any);
                  }
                  return (row as any)[key];
                }
              }
            })
          : (row as any)[column.accessorKey]}
      </TableCell>
    ))}
  </TableRow>
));

MemoizedTableRow.displayName = 'MemoizedTableRow';

// Memoized card row for mobile view
const MemoizedCardRow = memo(<T extends unknown>({ 
  row, 
  columns, 
  keyExtractor, 
  onRowClick 
}: { 
  row: T; 
  columns: Column<T>[]; 
  keyExtractor: (item: T) => string; 
  onRowClick?: (row: T) => void;
}) => (
  <Card
    key={keyExtractor(row)}
    className={`p-4 ${onRowClick ? "cursor-pointer hover:border-primary" : ""}`}
    onClick={() => onRowClick && onRowClick(row)}
  >
    {columns.map((column) => (
      <div key={`${keyExtractor(row)}-${String(column.accessorKey)}`} className="flex justify-between py-2 border-b last:border-0">
        <span className="font-medium text-sm text-muted-foreground">{column.header}</span>
        <span className="text-sm">
          {column.cell
            ? column.cell({
                row: {
                  original: row,
                  getValue: (key: string) => {
                    if (key.includes('.')) {
                      return key.split('.').reduce((obj, key) => obj && obj[key as keyof typeof obj], row as any);
                    }
                    return (row as any)[key];
                  }
                }
              })
            : (row as any)[column.accessorKey]}
        </span>
      </div>
    ))}
  </Card>
));

MemoizedCardRow.displayName = 'MemoizedCardRow';

export function ResponsiveTable<T>({
  columns,
  data,
  isLoading = false,
  noResultsMessage = "No data available",
  onRowClick,
  keyExtractor,
}: ResponsiveTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {noResultsMessage}
      </div>
    );
  }

  // Desktop view (normal table)
  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <MemoizedTableRow 
              key={keyExtractor(row)} 
              row={row} 
              columns={columns} 
              keyExtractor={keyExtractor} 
              onRowClick={onRowClick} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile view (card-based)
  const renderMobileRows = () => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {data.map((row) => (
        <MemoizedCardRow 
          key={keyExtractor(row)} 
          row={row} 
          columns={columns} 
          keyExtractor={keyExtractor} 
          onRowClick={onRowClick} 
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {renderDesktopTable()}
      {renderMobileRows()}
    </div>
  );
}

// Export a memoized version for better performance
export const MemoizedResponsiveTable = memo(ResponsiveTable) as typeof ResponsiveTable;
