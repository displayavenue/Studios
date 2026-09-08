export type UploadResult = {
  url: string;
  key: string;
  mock: boolean;
};

export interface StorageProvider {
  uploadPdf(buffer: Buffer, key: string): Promise<UploadResult>;
  getSignedUrl(key: string): Promise<string>;
}
