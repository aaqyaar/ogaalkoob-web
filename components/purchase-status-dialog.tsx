"use client";
import React from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { purchaseStatusSchema } from "@/validations/purchase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Purchase, PurchaseStatus } from "@/types";
import { usePurchaseStore } from "@/models/purchase.store";
import toast from "react-hot-toast";

interface PurchaseStatusDailogProps {
  open: boolean;
  onClose: () => void;
  row: Purchase;
}

export function PurchaseStatusDailog(props: PurchaseStatusDailogProps) {
  const { row } = props;
  const form = useForm<z.infer<typeof purchaseStatusSchema>>({
    resolver: zodResolver(purchaseStatusSchema),
    defaultValues: {
      userId: row.userId,
      purchaseId: row.id,
      status: row.status ? row.status : PurchaseStatus.PENDING,
    },
  });

  const { updatePurchaseStatus, status } = usePurchaseStore();

  const onSubmit = async (data: z.infer<typeof purchaseStatusSchema>) => {
    try {
      await updatePurchaseStatus(
        data.userId,
        data.purchaseId,
        data.status as PurchaseStatus
      );
      form.reset();
      props.onClose();
      toast.success("Purchase status updated successfully");

      window.location.reload();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const purchaseStatus = [
    PurchaseStatus.PENDING,
    PurchaseStatus.COMPLETED,
    PurchaseStatus.CANCELLED,
  ];

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-2">
              <Copy className="h-6 w-6" />
              <span>Change Status</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            <p>Change the status of the purchase.</p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {purchaseStatus.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end mt-3 gap-2">
              <Button
                type="submit"
                className="order-1"
                loading={status === "pending"}
              >
                Submit
              </Button>
              <DialogClose asChild onClick={props.onClose}>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
