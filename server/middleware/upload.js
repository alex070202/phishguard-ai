import multer from 'multer'

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
  fileFilter: (request, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new Error('Only JPG, PNG and WEBP files are supported.'))
      return
    }

    callback(null, true)
  },
})

export function uploadErrorHandler(error, request, response, next) {
  if (!error) {
    next()
    return
  }

  const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image file size must be 5MB or less.' : error.message
  response.status(400).json({ error: message })
}
