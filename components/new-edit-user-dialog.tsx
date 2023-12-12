"use client";
import React, { useEffect } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Role, Status, User } from "@/types";
import toast from "react-hot-toast";
import { registerSchema } from "@/validations/user";
import { useUserStore } from "@/models/users.store";
import { useAuthStore } from "@/models/auth-store";

interface NewEditUserDialogProps {
  open: boolean;
  onClose: () => void;
  row: User;
  isEdit?: boolean;
}

export function NewEditUserDialog(props: NewEditUserDialogProps) {
  const { row, isEdit } = props;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: row?.name || "",
      email: row?.email || "",
      password: row?.password || "",
      status: row?.status || Status.ACTIVE,
      phone: row?.phone || "",
      role: row?.role?.id || "",
    },
  });

  const {
    fetchUsers,
    fetchRoles,
    updateUser,
    status: userStatus,
  } = useUserStore();
  const { register, status } = useAuthStore();

  const fetchUsersByPagination = async () => fetchUsers({ page: 1, limit: 10 });

  const [roles, setRoles] = React.useState<Role[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetchRoles();
      setRoles(res.data);
    })();
  }, []);

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      if (isEdit) {
        await updateUser(row.id, { ...data });
        toast.success("User edited successfully");
        await fetchUsersByPagination();
        props.onClose();
        return;
      }
      await register(
        data.name,
        data.email,
        data.phone,
        data?.password as string
      );
      toast.success("User created successfully");
      form.reset();
      await fetchUsersByPagination();
      props.onClose();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const statuses = [Status.ACTIVE, Status.INACTIVE];

  console.log(form.formState.errors);

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-2">
              <span>New User</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            <p>Fill in the form below to create a new user.</p>
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
                        Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input id="phone" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isEdit && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                          {statuses.map((status) => (
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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles?.map(({ id, name }) => (
                            <SelectItem
                              key={id}
                              value={id}
                              className="capitalize"
                            >
                              {name}
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
                loading={status === "pending" || userStatus === "pending"}
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
