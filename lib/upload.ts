export type UploadResult = {
  fileName: string;
  fileUrl: string;
  contentType?: string;
};

export async function uploadImage(fileName: string): Promise<UploadResult> {
  const provider = process.env.UPLOAD_PROVIDER ?? "local";

  if (provider === "local") {
    return {
      fileName,
      fileUrl: `/uploads/${fileName}`
    };
  }

  return {
    fileName,
    fileUrl: `https://cdn.exemplo.pt/${fileName}`
  };
}
