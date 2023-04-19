import { Schema, model, Model } from 'mongoose'
import Roulette from '../../interfaces/roulette.interface'

const rouletteSchema = new Schema<Roulette>(
    {
        number: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    })

const rouletteModel: Model<Roulette> = model('roullete_numbers', rouletteSchema)

export default rouletteModel