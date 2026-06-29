import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import crypto from "crypto";
import { withTenant, TenantContext } from "@/lib/tenant/withTenant";

export const POST = withTenant(async (req: NextRequest, context: TenantContext) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2MB size limit (2 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image size too large. Please upload an image under 2MB." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop();
    // Generate a unique filename: timestamp + random hash + extension
    const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${fileExt}`;
    const contentType = file.type || "application/octet-stream";
    
    // Cloudflare R2 requires specifying the bucket name
    const bucketName = process.env.R2_BUCKET_NAME || "cosmuv-products";

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    if (!publicDomain) {
      throw new Error("R2_PUBLIC_DOMAIN is not set in environment variables");
    }

    // Construct the public URL
    const publicUrl = `${publicDomain}/${fileName}`;

    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
});

export const DELETE = withTenant(async (req: NextRequest, context: TenantContext) => {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const publicDomain = process.env.R2_PUBLIC_DOMAIN || "";
    if (!url.startsWith(publicDomain)) {
      return NextResponse.json({ error: "Invalid URL domain" }, { status: 400 });
    }

    const fileName = url.replace(publicDomain + "/", "");
    if (!fileName) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || "cosmuv-products";

    await r2.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("R2 Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message },
      { status: 500 }
    );
  }
});
