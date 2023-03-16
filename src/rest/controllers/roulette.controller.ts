

import { Request, Response } from 'express'
import IRoulette from '../interfaces/roulette.interface'
import { create, getLast } from '../services/roulette.service'

const createNumber = async () => {
    const number = Math.floor(Math.random() * 36)
    const roulette: IRoulette = {
        number,
    }
    create(roulette)
}

const getLastNumber = async (_req: Request, res: Response) => {
    const lastRoulette = await getLast()
    res.send(lastRoulette)
}

export { createNumber, getLastNumber }