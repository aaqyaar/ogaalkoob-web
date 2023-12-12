import prisma from "@/lib/prisma";
import { formatPhoneNumber, generateResetCode } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";
import MailService from "@/lib/nodemailer";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    if (!body.email) {
      return NextResponse.json(
        { message: "Email is required" },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with that email" },
        {
          status: 404,
        }
      );
    }

    const resetCode = generateResetCode();

    const inititiatePasswordReset = await prisma.passwordReset.create({
      data: {
        userId: user?.id,
        resetCode,
        resetCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    if (!inititiatePasswordReset) {
      return NextResponse.json(
        { message: "Something went wrong" },
        {
          status: 500,
        }
      );
    }

    // TODO: Send email with reset token
    const message = `${resetCode} is your verification code. \nPlease do not share this with anyone.`;

    const mailService = new MailService();

    await mailService.sendMail(user.email, "Password Reset", message);

    await axios.post("http://localhost:3000/api/sendText", {
      chatId: `${formatPhoneNumber(user.phone)}@c.us`,
      text: message,
      session: "default",
    });

    return NextResponse.json(
      { message: `Reset Password has been sent out ${user.email}` },
      {
        status: 200,
      }
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { message: error.message || error.toString() },
      {
        status: 500,
      }
    );
  }
}
