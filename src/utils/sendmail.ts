import nodemailer, { SentMessageInfo } from 'nodemailer'
import { env } from '~/constants/config'

import { EVerification } from '~/constants/enum'
import { BadRequestError } from '~/models/errors/errors'

export const sendVerification = async ({
  email,
  token,
  type = EVerification.Email
}: {
  email: string
  token: string
  type: EVerification
}): Promise<SentMessageInfo> => {
  if (!email || !token || type === undefined) {
    throw new BadRequestError()
  }
  // Khai báo kiểu trả về là Promise<SentMessageInfo>
  // Thiết lập transporter với thông tin SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, //587
    secure: true, //false // true nếu sử dụng SSL, thường là với port 465
    auth: {
      user: 'kiennguyen12.com@gmail.com',
      pass: `${env.PASSWORD_MAIL}`
    }
  })

  // URL xác minh
  const verificationUrl = `${env.CLIENT_URL}/${type ? 'verify-email' : 'forgot-password'}?token=${token}`

  // Cấu hình nội dung email
  const mailOptions = {
    from: '"Shop-Ecom" <your-email@example.com>',
    to: email,
    subject: `${type ? 'Email' : 'Forgot Password'} Verification`,
    html: `
      <p>Click the button below to verify:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">
        Verify
      </a>
    `
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(new Error(error.message))
      }
      resolve(info)
    })
  })
}
