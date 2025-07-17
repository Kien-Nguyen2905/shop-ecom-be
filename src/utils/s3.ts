import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import { env } from '~/constants/config'
const s3 = new S3({
  region: env.AWS_REGION as string,
  credentials: {
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: env.AWS_ACCESS_KEY_ID as string
  }
})
export const uploadFileToS3 = ({
  filename,
  filepath,
  contentType
}: {
  filename: string
  filepath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: 'shop-ecom',
      Key: filename,
      Body: fs.readFileSync(filepath),
      ContentType: contentType //Disautomatic dowload images
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 3, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })
  return parallelUploads3.done()
}

export const deleteFileFromS3 = async (fileUrls: string | string[]) => {
  const deleteFile = async (fileUrl: string) => {
    const url = new URL(fileUrl)
    const bucketName = url.hostname.split('.')[0]
    const key = decodeURIComponent(url.pathname.slice(1))

    const params = {
      Bucket: bucketName,
      Key: key
    }

    await s3.deleteObject(params)
  }

  if (Array.isArray(fileUrls)) {
    await Promise.all(fileUrls.map(deleteFile))
  } else {
    await deleteFile(fileUrls)
  }
}
