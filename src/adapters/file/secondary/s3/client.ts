import { S3Client } from '@aws-sdk/client-s3'
import type { DeepReadonly } from 'superTypes'

export type S3Config = {
  endpoint: string
  region: string
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
}
export const client = (config: DeepReadonly<S3Config>): S3Client => {
  const { endpoint, credentials, region }: S3Config = config
  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey
    },
    forcePathStyle: true
  })
}
