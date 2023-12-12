import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<User>[] = [
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
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },

  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },

  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => (
      <div className="font-medium">{row?.original?.role?.name}</div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "ACTIVE" ? "outline" : "destructive"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(date as string));

      return <div className="capitalize">{formatted ? formatted : "N/A"}</div>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
