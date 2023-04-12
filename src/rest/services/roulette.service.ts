import SRoulette from '../models/mongo/roulette.model'
import Roulette from '../interfaces/roulette.interface'

const create = async (roulette: Roulette) => {
    const newRoulette = new SRoulette(roulette)
    newRoulette.save()
    return newRoulette
}

const getLast = async () => {
    const lastRoulette = await SRoulette.findOne().sort({ _id: -1 })
    return lastRoulette
}

export { create, getLast }