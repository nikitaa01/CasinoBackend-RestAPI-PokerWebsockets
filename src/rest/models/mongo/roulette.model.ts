import { Schema, model, Model } from 'mongoose'
import IRoulette from '../../interfaces/roulette.interface'

const rouletteSchema = new Schema<IRoulette>(
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

const rouletteModel: Model<IRoulette> = model('roullete_numbers', rouletteSchema)

export default rouletteModel