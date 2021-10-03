import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '../externals/aws/s3'
import { v1 } from 'uuid'

export class S3Service {
  async getUploadFileUrls(fileType: string, fileSize: number): Promise<{ signedUrl: string; url: string }> {
    // create random file name to save on s3
    const fileName = v1() + '.' + fileType

    const S3_BUCKET = process.env.AWS_S3_BUCKET as string

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      ContentLength: fileSize,
      ACL: 'public-read',
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 })
    const url = `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`

    return { signedUrl, url }
  }
}
