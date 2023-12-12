import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";

import { Purchase, PurchaseStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Purchase>[] = [
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
    id: "book",
    header: "Book",
    accessorKey: "book",

    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-4">
          {row.original.books.map((book) => (
            <div key={book.id} className="flex items-center space-x-2">
              <div className="relative w-10 h-10 rounded-md">
                <Image
                  src={book.photos[0]}
                  alt={book.title}
                  className="w-8 h-8 rounded-md"
                  fill
                />
              </div>
              <h1>
                <span className="sr-only">Book title:</span>
                {book.title}
              </h1>
            </div>
          ))}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "user",
    header: "User",
    accessorKey: "user",

    cell: ({ row }) => {
      return (
        <div className="space-y-2">
          <h1>{row.original.user.name}</h1>
          <span className="text-sm text-muted-foreground">
            {row.original.user.role?.name}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "phoneNumber",
    header: "Phone Number",
    accessorKey: "phoneNumber",
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;

      return <div className="capitalize">{phoneNumber}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "paymentMethod",
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;

      return <Badge variant="default">{paymentMethod}</Badge>;
    },
    enableSorting: true,
    enableHiding: true,
  },

  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant={
            status === PurchaseStatus.PENDING
              ? "secondary"
              : status === PurchaseStatus.COMPLETED
              ? "default"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "amount",
    header: "Total Price",
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <span>{formattedAmount}</span>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: "Purchase Date",
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
