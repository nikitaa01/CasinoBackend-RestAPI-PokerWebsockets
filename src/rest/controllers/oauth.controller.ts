import { Request, Response } from "express";
import querystring from "querystring";

const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `http://localhost:3000/api/auth/login/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    return `${rootUrl}?${querystring.stringify(options)}`;
}

const redirectToGoogleAuth = (req: Request, res: Response) => {
    res.redirect(getGoogleAuthURL());
}

export { redirectToGoogleAuth };