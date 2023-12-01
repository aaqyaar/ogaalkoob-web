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
} from "@/components/ui";
import { useAuthStore } from "@/models/auth-store";
import { Label } from "@radix-ui/react-label";
import React from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { token, login } = useAuthStore((state) => state);

  const handleSignIn = async () => {
    login("abdizamedmo@gmail.com", "123456")
      .then((res) => {})
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Card className="w-[25rem]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Quickly sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="*********" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSignIn}>
          Sign in
        </Button>
      </CardFooter>
    </Card>
  );
}
