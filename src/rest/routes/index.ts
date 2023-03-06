import { Router } from "express"
import { readdirSync } from "fs"

const PATH_ROUTER = `${__dirname}`
const router = Router()

const cleanFileName = (fileName: string) => {
    const file = fileName.split(".").shift()
    return file
}

readdirSync(PATH_ROUTER).map((fileName) => {
    const cleanName = cleanFileName(fileName)
    if (cleanName !== "index") {
        import(`./${cleanName}.route`).then((importedRouter) => {
            router.use(`/api/${cleanName}`, importedRouter.router)
        })
    }
})

export default router