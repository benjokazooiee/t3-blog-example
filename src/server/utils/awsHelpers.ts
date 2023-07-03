import { S3, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { env } from "../../env.mjs";

const s3Config: S3ClientConfig = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
};
export const s3 = new S3(s3Config);

export const s3Client = new S3Client(s3Config);

export type ImageKeyObject = {
  authorId: string;
  imageId: string;
  fileType: string;
};
export const gets3ImageKey = ({
  authorId,
  imageId,
  fileType,
}: ImageKeyObject) => {
  return `${authorId}/${imageId}.${fileType}`;
};
