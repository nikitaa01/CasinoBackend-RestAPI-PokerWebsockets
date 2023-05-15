"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectToGoogleAuth = void 0;
const querystring_1 = __importDefault(require("querystring"));
const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `/api/auth/login/google/callback`,
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
const redirectToGoogleAuth = (req, res) => {
    res.redirect(getGoogleAuthURL());
};
exports.redirectToGoogleAuth = redirectToGoogleAuth;
