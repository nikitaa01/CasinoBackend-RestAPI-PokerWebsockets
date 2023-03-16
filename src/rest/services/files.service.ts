import fs from 'fs'

const PATH_STORAGE = `${process.cwd()}/public`

const findImagePathByName = (name: string) => {
    const files = fs.readdirSync(PATH_STORAGE)
    const filteredFiles = files.filter((file) => file.split(".")[0] === name)
    const filePath = `${PATH_STORAGE}/${filteredFiles[0] ?? 'gif_v1_sinfondo.gif'}`
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