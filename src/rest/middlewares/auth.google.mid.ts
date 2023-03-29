import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User, { UserPrivate } from "../interfaces/user.interface"
import { create, getUser, getUserByOauth } from "../services/users.service";

const googleAuth = () => {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost/prueba-oauth/",
            passReqToCallback: true,
        },
        async function (request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
            const resFindedUser = await getUserByOauth(profile.id)
            if (!resFindedUser.ok) {
                const resCreatedUser = await create({
                    first_name: profile.given_name,
                    last_name: profile.family_name,
                    email: profile.email,
                    password: profile.id,
                    avatar_url: profile.picture,
                    oauth_provider: "google",
                    oauth_provider_id: profile.id,
                } as UserPrivate)
                if (!resCreatedUser.ok) return done(null, false)
                return done(null, resCreatedUser.user)
            }
            return done(null, resFindedUser.user);
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user: false | User | null | undefined, done) {
        if (!user) return done(null, false)
        getUser(user.id).then((resFindedUser) => {
            if (!resFindedUser.ok) return done(null, false)
            done(null, user)
        })
    });
}

export default googleAuth