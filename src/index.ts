import express from 'express'
import { createServer as createServerHTTP } from 'http'
import WebSocket from 'ws'
import morgan from 'morgan'
import cors from 'cors'
import { config as dotenvConfig } from 'dotenv'
import routerWs from './ws/router/ws.router'
import routerRest from './rest/routes/index'
import db from './rest/config/mongo'
import cron from './rest/services/cron.service'
import path from 'path'
import googleAuth from './rest/middlewares/auth.google.mid'

dotenvConfig()
const app = express()
const pathPublic = path.join(process.cwd(), 'public')
app.use(express.static(pathPublic))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
googleAuth()

const server = createServerHTTP(express)
const wss = new WebSocket.Server({ server })

db().then(() => console.log('db connected'))

wss.on('connection', routerWs)

app.use(routerRest)

cron.start()

app.listen(process.env.PORT_REST, () => console.log(`api rest running on port ${process.env.PORT_REST}`))
server.listen(process.env.PORT_WS, () => console.log(`api ws running on port ${process.env.PORT_WS}`))