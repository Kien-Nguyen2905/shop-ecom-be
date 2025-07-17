import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { env } from 'process'
import { EVerification } from '~/constants/enum'
import { BadRequestError } from '~/models/errors/errors'

// Create SES service object.
const sesClient = new SESClient({
  region: env.AWS_REGION as string,
  credentials: {
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: env.AWS_ACCESS_KEY_ID as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

export const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })
  return new Promise((resolve, reject) => {
    sesClient.send(sendEmailCommand, (error, info) => {
      if (error) {
        return reject(new Error(error.message))
      }
      resolve(info)
    })
  })
}

export const sendVerification = async ({
  email,
  token,
  type = EVerification.Email
}: {
  email: string
  token: string
  type: EVerification
}): Promise<void> => {
  if (!email || !token || type === undefined) {
    throw new BadRequestError()
  }

  // URL xác minh
  const verificationUrl = `${process.env.CORS_ORIGIN}/${type === EVerification.Email ? 'verify-email' : 'forgot-password'}?token=${token}`

  // Tiêu đề và nội dung email
  const subject = `${type === EVerification.Email ? 'Email' : 'Forgot Password'} Verification`
  const body = `
    <p>Click the button below to verify:</p>
    <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">
      Verify
    </a>
  `

  await sendVerifyEmail(email, subject, body)
}
