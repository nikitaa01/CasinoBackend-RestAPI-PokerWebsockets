import fs from 'fs'

const PATH_STORAGE = `${process.env.ROOT_DIR ?? process.cwd()}/public`

const findImagePathByName = (name: string) => {
    const files = fs.readdirSync(PATH_STORAGE)
    const filteredFiles = files.filter((file) => file.split(".")[0] === name)
    if (filteredFiles.length == 0) return undefined
    const filePath = `${PATH_STORAGE}/${filteredFiles[0]}`
    return filePath
}

const deleteImages = async (name: string) => {
    const files = await fs.promises.readdir(PATH_STORAGE)
    const filteredFiles = files.filter((file) => file.split(".")[0] === name)
    await Promise.all(
        filteredFiles.map(async (file) => {
            await fs.promises.unlink(`${PATH_STORAGE}/${file}`)
        })
    )
}

export { findImagePathByName, deleteImages }