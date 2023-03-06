import SRoulette from '../models/mongo/roulette.model'
import IRoulette from '../interfaces/roulette.interface'

const create = async (roulette: IRoulette) => {
    const newRoulette = new SRoulette(roulette)
    return newRoulette
}

const getLast = async () => {
    const lastRoulette = await SRoulette.findOne().sort({ _id: -1 })
    return lastRoulette
}

export { create, getLast }