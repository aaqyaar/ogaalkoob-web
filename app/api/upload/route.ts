import { getEnv, getErrorResponse } from "./../../../lib/helpers";
import { NextRequest, NextResponse } from "next/server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

const uploadObject = async (fileName: string, data: any, bucket: string) => {
  const s3Client = new S3Client({
    endpoint: getEnv("AWS_R2_ENDPOINT"),
    forcePathStyle: true,
    region: "us-east-1",
    credentials: {
      accessKeyId: getEnv("AWS_R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("AWS_R2_ACCESS_SECRET"),
    } as Credentials,
  });

  const params = {
    Bucket: getEnv("AWS_R2_BUCKET_NAME"),
    Key: fileName,
    Body: data,
    ACL: "public-read" as const,
    Metadata: {
      "x-amz-meta-my-key": "ogaalkoob-bucket",
    },
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));

    return data;
  } catch (error) {
    const err = error as Error;
    console.log("Error", err?.message);
    throw {
      message: err?.message,
      status: 500,
    };
  }
};

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const data = await req.formData();
    const files: File[] | null = data.getAll("file") as unknown as File[];
    console.log(type, files);
    const allowedImageTypes = [".png", ".jpg", ".jpeg", ".gif"];
    const allowedDocumentTypes = [".pdf", ".doc", ".docx", ".txt"];
    const allowedAudioTypes = [".mp3", ".wav", ".m4a"];
    const allowedTypes = ["document", "image", "audio"];

    if (!allowedTypes.includes(type as string))
      return getErrorResponse("Invalid file type", 400);

    const isAllowed = files.every((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      console.log(ext);
      if (type === "image") return allowedImageTypes.includes(`.${ext}`);
      if (type === "audio") return allowedAudioTypes.includes(`.${ext}`);
      if (type === "document") return allowedDocumentTypes.includes(`.${ext}`);
    });

    if (!isAllowed) return getErrorResponse("Invalid file type", 400);

    const promises = files.map(async (file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${file.name.split(".")[0]}-${Date.now()}.${ext}`;
      let buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));

      if (type === "image") {
        const size = Buffer.byteLength(Buffer.from(buffer));
        if (size > 200000) {
          buffer = await sharp(buffer).resize(400).toBuffer();
        }
      }

      //   await writeFile(filePath, buffer)
      await uploadObject(fileName, buffer, "images");
      return fileName;
    });
    const fileUrls = await Promise.all(promises);
    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        data: fileUrls.map(
          (url) => `${getEnv("CLOUDFLARE_BUCKER_URL")}/${url}`
        ),
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    console.log(error);
    const formattedError = error.message || error.toString();
    return NextResponse.json(
      { message: formattedError },
      {
        status: 500,
      }
    );
  }
}
