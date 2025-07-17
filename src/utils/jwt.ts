import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
config()

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = <T>({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as T)
    })
  })
}
export const decodeToken = <T>({ token }: { token: string }): Promise<T | null> => {
  return new Promise<T | null>((resolve, reject) => {
    const decoded = jwt.decode(token)

    if (!decoded) {
      return reject(new Error('Invalid token'))
    }

    resolve(decoded as T)
  })
}
