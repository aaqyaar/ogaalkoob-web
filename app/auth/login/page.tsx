"use client";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { useAuthStore } from "@/models/auth.store";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { loginSchema } from "@/validations/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatError } from "@/lib/format-err";

export default function LoginPage() {
  const { login, status, setStatus } = useAuthStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    login(data.username, data.password)
      .then((res) => {
        if (res && res.token) {
          router.replace("/dashboard");
        }
      })
      .catch((err) => {
        setStatus("fail");
        const error = formatError(err);
        // const error = err as Error;
        toast.error(error);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[25rem]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Quickly sign in to your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Phone</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      type="text"
                      placeholder="m@example.com or 1234567890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="*********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              loading={status === "pending"}
            >
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
