import { getSvgImage } from '../services/avatar.service'
import { Request, Response } from 'express'
import { findImagePathByName } from '../services/files.service'

const getAvatar = async (req: Request, res: Response) => {
    const fileName = req.params.id
    if (!fileName) {
        return res.status(404).send({ message: 'Avatar Not found' })
    }
    const routeImg = findImagePathByName(fileName)
    if (routeImg) {
        return res.sendFile(routeImg)
    }
    const svgImage = await getSvgImage(fileName);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgImage);
}

export { getAvatar }