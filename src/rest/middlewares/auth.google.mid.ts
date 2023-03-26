import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import IUser from "../interfaces/user.interface"

const googleAuth = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:3000/api/users/login/google/callback",
        passReqToCallback: true,
    },
    function (request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
        return done(null, profile);
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user: false | IUser | null | undefined, done) {
        done(null, user);
    });
}

export default googleAuth