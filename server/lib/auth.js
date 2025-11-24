import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "#server/generated/prisma/client.ts";
import dotenv from 'dotenv'
const prisma = new PrismaClient();


dotenv.config({path: '../.env'})
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            scope: [
                "openid",
                "email",
                "profile",
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.app.created",
                "https://www.googleapis.com/auth/calendar.freebusy"
            ],
            accessType: "offline",            // very important: you need a refresh token
            prompt: "select_account", // ensures refresh token is granted
        },
    },
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [
        "http://localhost:5173", // your frontend
        "http://localhost:3000"  // backend itself, if needed
    ],
});