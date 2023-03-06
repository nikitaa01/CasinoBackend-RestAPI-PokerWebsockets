import "dotenv/config"
import { connect } from "mongoose"

async function dbConnect(): Promise<void> {
    try {
        const DB_URI = <string>process.env.MONGO_URI
        await connect(DB_URI)
    } catch (error: any) {
        console.error('ERROR: mongo => dbConnect', error.message)
    }
}

export default dbConnect