import React from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { Row } from "@tanstack/react-table";
import { FaPencilRuler } from "react-icons/fa";
import { createPortal } from "react-dom";
import { User } from "@/types";
import { NewEditUserDialog } from "@/components/new-edit-user-dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => {
            openDialog();
          }}
        >
          <Edit className="mr-2" width={16} height={16} />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            openDialog();
          }}
        >
          <Trash className="mr-2 text-red-500" width={16} height={16} />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>

      {createPortal(
        <NewEditUserDialog
          open={dialogOpen}
          onClose={closeDialog}
          row={row.original as User}
          isEdit
        />,
        document.getElementById("modal-root") as HTMLElement
      )}
    </DropdownMenu>
  );
}
