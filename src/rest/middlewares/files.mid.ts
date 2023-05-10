import { Request } from "express"
import multer, { diskStorage } from "multer"
import { deleteImages } from "../services/files.service"
import { updateUser } from "../services/users.service"

const PATH_STORAGE = `${process.cwd()}/public`

const storage = diskStorage({
    destination(_req: Request, _file: Express.Multer.File, cb: any) {
        cb(null, PATH_STORAGE)
    },
    async filename(req: Request, file: Express.Multer.File, cb: any) {
        const extensions = ["jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "raw", "svg", "webp"];
        const ext = file.originalname.split(".").pop()
        if (!extensions.includes(ext as string)) {
            return cb("Extension not allowed")
        }
        const fileName = req.user?.id ? `${req.user.id}.${ext}` : `file-${Date.now()}.${ext}`
        if (req.user?.id) {
            if (req.user.avatar_url.startsWith('http')) {
                updateUser(req.user.id, {avatar_url: `/api/avatar/${req.user.id}`})
            }
            await deleteImages(String(req.user.id))
        }
        cb(null, fileName)
    },
})

const multerMiddleware = multer({ storage })

export default multerMiddleware