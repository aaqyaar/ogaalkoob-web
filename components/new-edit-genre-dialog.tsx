"use client";
import React from "react";

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
  Input,
} from "@/components/ui";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Genre } from "@/types";
import toast from "react-hot-toast";
import { genreSchema } from "@/validations/books";
import { useGenreStore } from "@/models/genre.store";

interface NewEditGenreDialogProps {
  open: boolean;
  onClose: () => void;
  row: Genre;
  isEdit?: boolean;
}

export function NewEditGenreDialog(props: NewEditGenreDialogProps) {
  const { row, isEdit } = props;

  const form = useForm<z.infer<typeof genreSchema>>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: row?.name || "",
    },
  });

  const { updateGenre, createGenre, status, fetchGenreByPagination } =
    useGenreStore();

  const fetchGenres = async () =>
    fetchGenreByPagination({ page: 1, limit: 10 });

  const onSubmit = async (data: z.infer<typeof genreSchema>) => {
    try {
      if (isEdit) {
        await updateGenre(row?.id as string, data);
        toast.success("Genre edited successfully");
        await fetchGenres();
        props.onClose();
        return;
      }
      await createGenre(data);
      toast.success("Genre created successfully");
      form.reset();
      await fetchGenres();
      props.onClose();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-2">
              <span>New Genre</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            <p>Fill in the form below to create a new genre.</p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Genre Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="name" type="text" {...field} />
                      </FormControl>
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
