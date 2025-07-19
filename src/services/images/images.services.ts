import { Request } from 'express'
import { getNameFromFullname, handleImage } from '~/utils/file'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import fsPromise from 'fs/promises'
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
        const s3Result = await uploadFileToS3({
          filename: newFullFileName,
          filepath: newPath,
          contentType: 'image/jpeg' as string
        })
        // delete image folder temp and folder images for using s3
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return s3Result.Location
      })
    )
    return result
  }

  async deleteImage(image: string | string[]) {
    // using s3
    await deleteFileFromS3(image)
  }
}

const imagesService = new ImagesService()

export default imagesService
