/**
 * S3-compatible object storage — SERVER-SIDE ONLY.
 * TODO: Implement with @aws-sdk/client-s3 in @homeopathypharma/api.
 */

export interface S3UploadInput {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  metadata?: Record<string, string>;
  /** When true, object is publicly readable via CDN. */
  publicRead?: boolean;
}

export interface S3UploadResult {
  key: string;
  etag: string;
  url: string;
}

export interface S3SignedUrlInput {
  key: string;
  expiresInSeconds: number;
  operation: "getObject" | "putObject";
}

export interface S3Client {
  upload(input: S3UploadInput): Promise<S3UploadResult>;
  signedUrl(input: S3SignedUrlInput): Promise<string>;
  delete(key: string): Promise<void>;
}

export class S3NotConfiguredError extends Error {
  constructor() {
    super("S3 storage not configured. Set S3_ENDPOINT, S3_BUCKET, and credentials.");
    this.name = "S3NotConfiguredError";
  }
}

export const stubS3Client: S3Client = {
  async upload() {
    throw new S3NotConfiguredError();
  },
  async signedUrl() {
    throw new S3NotConfiguredError();
  },
  async delete() {
    throw new S3NotConfiguredError();
  },
};
