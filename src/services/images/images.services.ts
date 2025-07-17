import { Request } from 'express'
import { getNameFromFullname, handleImage } from '~/utils/file'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
// import fsPromise from 'fs/promises'
import { env, isProduction } from '~/constants/config'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { deleteFileFromS3, uploadFileToS3 } from '~/utils/s3'
class ImagesService {
  async uploadImage(req: Request) {
    const file = await handleImage(req)

    // use promise.all to file in file.map execution faster, rather than use file.map normally
    const result = await Promise.all(
      file.map(async (file) => {
        // get name
        const newName = getNameFromFullname(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        // get path
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        // covert to jpeg decrease size image
        await sharp(file.filepath).jpeg().toFile(newPath)
        // using s3
        // const s3Result = await uploadFileToS3({
        //   filename: newFullFileName,
        //   filepath: newPath,
        //   contentType: 'image/jpeg' as string
        // })
        fs.unlinkSync(file.filepath)
        // delete image folder temp and folder images for using s3
        // await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        // return s3Result.Location

        return isProduction
          ? `${env.HOST}/static/${newFullFileName}`
          : `http://localhost:${env.PORT}${env.API_VERSION}/static/image/${newFullFileName}`
      })
    )
    return result
  }
  async deleteImage(image: string | string[]) {
    // using s3
    // await deleteFileFromS3(image)

    const images = Array.isArray(image) ? image : [image]

    // Duyệt qua danh sách ảnh
    for (const img of images) {
      // Lấy tên file từ URL (phần cuối cùng sau dấu '/')
      const fileName = img.split('/').pop()

      if (!fileName) {
        throw new Error(`Invalid image URL: ${img}`)
      }

      // Đường dẫn tuyệt đối tới file trong thư mục uploads/images
      const filePath = path.resolve(UPLOAD_IMAGE_DIR, fileName)

      // Kiểm tra file có tồn tại hay không
      if (fs.existsSync(filePath)) {
        // Xóa file
        fs.unlinkSync(filePath)
      }
    }
  }
}

const imagesService = new ImagesService()

export default imagesService
