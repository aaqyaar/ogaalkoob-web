import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Genre } from "@/types";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Genre>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Genre Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Genre Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date as string));

      return <div className="capitalize">{formatted ? formatted : "N/A"}</div>;
    },
  },

  {
    accessorKey: "books",
    header: "Total Books",
    cell: ({ row }) => {
      const books = row.original.books;
      return <div className="capitalize ml-4">{books.length}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
