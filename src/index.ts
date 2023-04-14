import express from 'express'
import { createServer as createServerHTTP } from 'http'
import WebSocket from 'ws'
import morgan from 'morgan'
import cors from 'cors'
import { config as dotenvConfig } from 'dotenv'
import routerWs from './ws/router/ws.router'
import routerRest from './rest/routes/index'
import session from 'express-session'
import db from './rest/config/mongo.config'
import cron from './rest/services/cron.service'
import path from 'path'

dotenvConfig()
const app = express()
const pathPublic = path.join(process.cwd(), 'public')
app.use(express.json())
app.use(express.static(pathPublic))
app.use(morgan('dev'))
app.use(cors())
app.use(session({
    secret: process.env.SECRET as string,
    resave: true,
    saveUninitialized: true,
}))

const server = createServerHTTP(express)
const wss = new WebSocket.Server({ server })

db().then(() => console.log('db connected'))

wss.on('connection', routerWs)

app.use(routerRest)

// cron.start()

app.listen(process.env.PORT_REST, () => console.log(`api rest running on port ${process.env.PORT_REST}`))
server.listen(process.env.PORT_WS, () => console.log(`api ws running on port ${process.env.PORT_WS}`))