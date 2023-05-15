"use strict";
exports.__esModule = true;
exports.redirectToGoogleAuth = void 0;
var querystring_1 = require("querystring");
var getGoogleAuthURL = function () {
    var rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    var options = {
        redirect_uri: "/api/auth/login/google/callback",
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" ")
    };
    return "".concat(rootUrl, "?").concat(querystring_1["default"].stringify(options));
};
var redirectToGoogleAuth = function (req, res) {
    res.redirect(getGoogleAuthURL());
};
exports.redirectToGoogleAuth = redirectToGoogleAuth;
