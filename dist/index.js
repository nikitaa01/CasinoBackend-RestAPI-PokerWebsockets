"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = __importDefault(require("ws"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const ws_router_1 = __importDefault(require("./ws/router/ws.router"));
const index_1 = __importDefault(require("./rest/routes/index"));
const express_session_1 = __importDefault(require("express-session"));
const mongo_config_1 = __importDefault(require("./rest/config/mongo.config"));
const cron_service_1 = __importDefault(require("./rest/services/cron.service"));
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const pathPublic = path_1.default.join(process.cwd(), 'public');
app.use(express_1.default.json());
app.use(express_1.default.static(pathPublic));
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    name: 'express.session.id',
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
}));
const server = (0, http_1.createServer)(express_1.default);
const wss = new ws_1.default.Server({ server, path: '/ws' });
(0, mongo_config_1.default)().then(() => console.log('db connected'));
wss.on('connection', ws_router_1.default);
app.use(index_1.default);
cron_service_1.default.start();
app.listen(process.env.PORT_REST, () => console.log(`api rest running on port ${process.env.PORT_REST}`));
server.listen(process.env.PORT_WS, () => console.log(`api ws running on port ${process.env.PORT_WS}`));
