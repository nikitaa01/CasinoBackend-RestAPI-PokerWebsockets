import axios from "axios";
import querystring from "querystring";
import Response from '../types/response.type'

const getGoogleAuthURL = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.ROOT_URI}/api/auth/login/google/callback`,
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

const getGoogleToken = async (code: string): Response<{
    access_token: string,
    id_token: string,
}> => {
    const rootUrl = "https://oauth2.googleapis.com/token";
    const options = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: `${process.env.ROOT_URI}/api/auth/login/google/callback`,
        grant_type: "authorization_code",
    };
    const url = `${rootUrl}?${querystring.stringify(options)}`;
    try {
        const res = await axios(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const data = res.data as {
            access_token: string,
            id_token: string,
        };
        return {
            ok: true,
            data,
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
        }
    }
}

const getGoogleProfile = async (access_token: string, id_token: string): Response<{
    given_name: string,
    family_name: string,
    email: string,
    id: string,
    picture: string,
}> => {
    const url = `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`
    const res = await axios(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${id_token}`,
        },
    });
    try {
        const data = res.data as {
            given_name: string,
            family_name: string,
            email: string,
            id: string,
            picture: string,
        }
        return {
            ok: true,
            data
        }
    } catch (error) {
        return {
            ok: false,
        }
    }
}

export { getGoogleAuthURL, getGoogleToken, getGoogleProfile }