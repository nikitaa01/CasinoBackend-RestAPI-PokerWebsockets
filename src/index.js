"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var ws_1 = require("ws");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var ws_router_1 = require("./ws/router/ws.router");
var index_1 = require("./rest/routes/index");
var express_session_1 = require("express-session");
var mongo_config_1 = require("./rest/config/mongo.config");
var cron_service_1 = require("./rest/services/cron.service");
var path_1 = require("path");
(0, dotenv_1.config)();
var app = (0, express_1["default"])();
var pathPublic = path_1["default"].join(process.cwd(), 'public');
app.use(express_1["default"].json());
app.use(express_1["default"].static(pathPublic));
app.use((0, morgan_1["default"])('dev'));
app.use((0, cors_1["default"])());
app.use((0, express_session_1["default"])({
    name: 'express.session.id',
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
}));
var server = (0, http_1.createServer)(express_1["default"]);
var wss = new ws_1["default"].Server({ server: server, path: '/ws' });
(0, mongo_config_1["default"])().then(function () { return console.log('db connected'); });
wss.on('connection', ws_router_1["default"]);
app.use(index_1["default"]);
cron_service_1["default"].start();
app.listen(process.env.PORT_REST, function () { return console.log("api rest running on port ".concat(process.env.PORT_REST)); });
server.listen(process.env.PORT_WS, function () { return console.log("api ws running on port ".concat(process.env.PORT_WS)); });
