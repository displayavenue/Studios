import type { StorageProvider, UploadResult } from "./types";

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
  return new MockStorageProvider();
}
