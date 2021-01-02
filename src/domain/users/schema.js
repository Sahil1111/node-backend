const yup = require('yup')
const aws = require('aws-sdk')
const fs = require('fs')

const uploadFile = async ({ fileName, filePath, fileType }) => {
  return new Promise((resolve, reject) => {
    aws.config.update({
      region: 'us-east-2',
      accessKeyId: 'yourAccessId',
      secretAccessKey: 'yourAccessKeys'
    })

    const s3 = new aws.S3({
      apiVersion: '2006-03-01'
      // If you want to specify a different endpoint, such as using DigitalOcean spaces
      // endpoint: new aws.Endpoint("nyc3.digitaloceanspaces.com"),
    })

    const stream = fs.createReadStream(filePath)
    stream.on('error', function(err) {
      reject(err)
    })

    s3.upload(
      {
        ACL: 'public-read',
        // You'll input your bucket name here
        Bucket: 'YourS3Bucket',
        Body: stream,
        Key: fileName,
        ContentType: fileType
      },
      function(err, data) {
        if (err) {
          reject(err)
        } else if (data) {
          resolve({ key: data.Key, url: data.Location })
        }
      }
    )
  })
}

const userSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required()
      .email()
      .lowercase()
      .trim(),

    password: yup.string().when('$validatePassword', {
      is: true,
      then: yup
        .string()
        .required()
        .min(8)
        .max(30)
    }),

    token: yup
      .string()
      .required()
      .max(1000)
      .trim(),

    name: yup
      .string()
      .required()
      .max(40)
      .default('')
      .trim()
  })
  .noUnknown()

const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required()
      .email()
      .lowercase()
      .trim(),

    password: yup
      .string()
      .required()
      .trim()
  })
  .noUnknown()

const forgotSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required()
      .email()
      .lowercase()
      .trim()
  })
  .noUnknown()

module.exports = {
  userSchema,
  loginSchema,
  forgotSchema,
  uploadFile
}
