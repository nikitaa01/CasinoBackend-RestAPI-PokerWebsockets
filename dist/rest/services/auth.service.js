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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleProfile = exports.getGoogleToken = exports.getGoogleAuthURL = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.ROOT_URI}/api/auth/login/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    return `${rootUrl}?${querystring_1.default.stringify(options)}`;
};
exports.getGoogleAuthURL = getGoogleAuthURL;
const getGoogleToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const rootUrl = "https://oauth2.googleapis.com/token";
    const options = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.ROOT_URI}/api/auth/login/google/callback`,
        grant_type: "authorization_code",
    };
    const url = `${rootUrl}?${querystring_1.default.stringify(options)}`;
    try {
        const res = yield (0, axios_1.default)(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const data = res.data;
        return {
            ok: true,
            data,
        };
    }
    catch (error) {
        console.log(error);
        return {
            ok: false,
        };
    }
});
exports.getGoogleToken = getGoogleToken;
const getGoogleProfile = (access_token, id_token) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`;
    const res = yield (0, axios_1.default)(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${id_token}`,
        },
    });
    try {
        const data = res.data;
        return {
            ok: true,
            data
        };
    }
    catch (error) {
        return {
            ok: false,
        };
    }
});
exports.getGoogleProfile = getGoogleProfile;
