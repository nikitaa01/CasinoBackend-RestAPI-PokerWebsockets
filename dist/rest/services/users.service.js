"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBalance = exports.updatePassword = exports.getUserByOauth = exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUsers = exports.getUser = exports.create = void 0;
const client_1 = require("@prisma/client");
const uuidv4_1 = require("uuidv4");
const bcrypt_1 = require("bcrypt");
const create = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prisma = new client_1.PrismaClient();
        user.id = (0, uuidv4_1.uuid)();
        user.password = yield (0, bcrypt_1.hash)(user.password, 10);
        user.avatar_url = (_a = user.avatar_url) !== null && _a !== void 0 ? _a : `/api/avatar/${user.id}`;
        const newUser = yield prisma.users.create({
            data: user
        });
        prisma.$disconnect();
        return { ok: true, data: newUser };
    }
    catch (e) {
        console.log(e);
        return { ok: false };
    }
});
exports.create = create;
const getUsers = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const data = yield prisma.users.findMany({
            select: {
                id: true,
                role: true,
                email: true,
                coin_balance: true,
                first_name: true,
                last_name: true,
                avatar_url: true,
                oauth_provider: false,
                oauth_provider_id: false,
                created_at: true,
                updated_at: true,
                password: false
            },
            skip,
            take: limit
        });
        prisma.$disconnect();
        if (!data) {
            return { ok: false };
        }
        return { ok: true, data };
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
exports.getUsers = getUsers;
const getUserTemplate = (password, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const response = yield prisma.users.findUnique({
            where: query,
            select: {
                id: true,
                role: true,
                email: true,
                coin_balance: true,
                first_name: true,
                last_name: true,
                avatar_url: true,
                oauth_provider: password,
                oauth_provider_id: password,
                created_at: true,
                updated_at: true,
                password
            },
        });
        if (!response) {
            return { ok: false };
        }
        prisma.$disconnect();
        const data = password ? response : response;
        return { ok: true, data };
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
const getUser = (idQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const resUser = yield getUserTemplate(false, { id: idQuery });
    if (resUser.ok) {
        resUser.data = Object.assign({ password: undefined }, resUser.data);
    }
    return resUser;
});
exports.getUser = getUser;
const getUserByEmail = (password, emailQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const resUser = yield getUserTemplate(password, { email: emailQuery });
    return resUser;
});
exports.getUserByEmail = getUserByEmail;
const getUserByOauth = (oauthQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const resUser = yield getUserTemplate(false, { oauth_provider_id: oauthQuery });
    if (resUser.ok) {
        resUser.data = Object.assign({ password: undefined }, resUser.data);
    }
    return resUser;
});
exports.getUserByOauth = getUserByOauth;
const updateUser = (id, dataToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const response = yield prisma.users.update({
            where: { id },
            data: dataToUpdate,
        });
        if (!response) {
            return { ok: false };
        }
        const data = response;
        prisma.$disconnect();
        return { ok: true, data };
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
exports.updateUser = updateUser;
const addBalance = (id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const response = yield prisma.users.update({
            where: { id },
            data: { coin_balance: { increment: amount } },
        });
        if (!response) {
            return { ok: false };
        }
        const data = response;
        prisma.$disconnect();
        return { ok: true, data };
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
exports.addBalance = addBalance;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const response = yield prisma.users.delete({
            where: { id },
        });
        if (!response) {
            return { ok: false };
        }
        prisma.$disconnect();
        return { ok: true, data: null };
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
exports.deleteUser = deleteUser;
const updatePassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = new client_1.PrismaClient();
        const response = yield prisma.users.update({
            where: { email },
            data: { password: yield (0, bcrypt_1.hash)(password, 10) },
        });
        if (!response) {
            return { ok: false };
        }
        prisma.$disconnect();
        return { ok: true, data: null };
    }
    catch (error) {
        console.log(error);
        return { ok: false };
    }
});
exports.updatePassword = updatePassword;
