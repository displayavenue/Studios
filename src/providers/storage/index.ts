import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import type { StorageProvider, UploadResult } from "./types";

const ROOT = process.env.PDF_STORAGE_DIR || path.join(process.cwd(), ".data", "pdfs");

export class FilesystemStorageProvider implements StorageProvider {
  async uploadPdf(buffer: Buffer, key: string): Promise<UploadResult> {
    const safe = key.replace(/\.\./g, "").replace(/^\/+/, "");
    const full = path.join(ROOT, safe);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, buffer);
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.vercel.app";
    return {
      url: `${base}/api/storage/pdf?key=${encodeURIComponent(safe)}`,
      key: safe,
      mock: false,
    };
  }

  async getSignedUrl(key: string): Promise<string> {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.vercel.app";
    return `${base}/api/storage/pdf?key=${encodeURIComponent(key)}`;
  }
}

export class S3StorageProvider implements StorageProvider {
  async uploadPdf(buffer: Buffer, key: string): Promise<UploadResult> {
    const bucket = process.env.S3_BUCKET!;
    const region = process.env.S3_REGION || "ap-south-1";
    const accessKeyId = process.env.S3_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!;
    const publicBase = process.env.S3_PUBLIC_URL || `https://${bucket}.s3.${region}.amazonaws.com`;

    // Prefer AWS SDK if installed; otherwise fall back to filesystem.
    try {
      const awsSdk = "@aws-sdk/client-s3";
      // Dynamic package name keeps TypeScript from requiring the optional dependency at compile time.
      const aws = (await import(awsSdk)) as {
        S3Client: new (cfg: object) => { send: (cmd: unknown) => Promise<unknown> };
        PutObjectCommand: new (input: object) => unknown;
      };
      const client = new aws.S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
      await client.send(
        new aws.PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: "application/pdf",
        }),
      );
      return { url: `${publicBase}/${key}`, key, mock: false };
    } catch (err) {
      console.warn("[storage:s3] SDK upload failed, using filesystem fallback", err);
      return new FilesystemStorageProvider().uploadPdf(buffer, key);
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    const publicBase = process.env.S3_PUBLIC_URL;
    if (publicBase) return `${publicBase}/${key}`;
    return new FilesystemStorageProvider().getSignedUrl(key);
  }
}

export class MockStorageProvider implements StorageProvider {
  async uploadPdf(_buffer: Buffer, key: string): Promise<UploadResult> {
    return {
      url: `https://storage.mock.jyotishkundali.com/${key}`,
      key,
      mock: true,
    };
  }

  async getSignedUrl(key: string): Promise<string> {
    return `https://storage.mock.jyotishkundali.com/${key}?signed=mock`;
  }
}

export function createStorageProvider(): StorageProvider {
  if (process.env.STORAGE_PROVIDER === "mock") return new MockStorageProvider();
  if (
    process.env.STORAGE_PROVIDER === "s3" &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  ) {
    return new S3StorageProvider();
  }
  return new FilesystemStorageProvider();
}

export async function readStoredPdf(key: string): Promise<Buffer | null> {
  try {
    const safe = key.replace(/\.\./g, "").replace(/^\/+/, "");
    const full = path.join(ROOT, safe);
    return await readFile(full);
  } catch {
    return null;
  }
}
