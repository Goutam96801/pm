import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { verifyUserService } from "../services/auth.service";
import UserModel from "../models/user.model";

// Google OAuth removed: using local email/password authentication only

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await UserModel.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});