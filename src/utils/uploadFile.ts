// // import { v2 as cloudinary } from 'cloudinary'
// import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
// import crypto from 'crypto'
// import sharp from 'sharp'

// // create upload instance of multer
// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
//     secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
//   },
//   region: process.env.AWS_BUCKET_REGION!,
// })

// const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// async function getFileUrl(key: string) {
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: key,
//   }

//   const command = new GetObjectCommand(params)
//   const url = await getSignedUrl(s3, command, { expiresIn: undefined })

//   return url
// }

// async function uploadFile(file: any, shape?: string) {
//   let size: any = { height: 480, width: 854, fit: 'cover' }
//   if (shape === '1:1') {
//     size.height = 480
//     size.width = 480
//   } else if (shape === '9:16') {
//     size.height = 854
//     size.width = 480
//   } else if (shape === '4:3') {
//     size.height = 640
//     size.width = 480
//   } else if (shape === '3:4') {
//     size.height = 480
//     size.width = 640
//   }

//   // resize image before send to s3 (16:9)
//   const buffer = Buffer.from(await file.arrayBuffer())
//   const resizeBuffer = await sharp(buffer).resize(size).toBuffer()

//   // const fileName = randomFileName()
//   const filename = randomFileName()

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: filename,
//     Body: resizeBuffer,
//     ContentType: file.type,
//   }

//   const command = new PutObjectCommand(params)
//   s3.send(command)

//   return `https://${process.env.AWS_BUCKET_NAME!}.s3.${process.env
//     .AWS_BUCKET_REGION!}.amazonaws.com/${filename}`
// }

// async function deleteFile(key: string) {
//   if (key.startsWith('http')) {
//     key = key.split(
//       `https://${process.env.AWS_BUCKET_NAME!}.s3.${process.env.AWS_BUCKET_REGION!}.amazonaws.com/`
//     )[1]
//   }

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: key,
//   }

//   const command = new DeleteObjectCommand(params)
//   await s3.send(command)
// }

// export { deleteFile, getFileUrl, uploadFile }
