import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

// const accountSchema = z.object ({
//   provider
// })

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: {
        email: string;
        name: string;
      };
      account: {
        providers: "google" | "github";
      };
    }) {
      console.log("Hii signin");

      const userValidation = userSchema.safeParse(user);
      if (!userValidation.success) {
        console.error("Invalid user data", userValidation.error.errors);
        return false;
      }

      // if (!user || !user.email) {
      //   return false;
      // }
      //
      try {
        await db.merchant.upsert({
          select: {
            id: true,
          },
          where: {
            email: user.email,
          },
          create: {
            email: user.email,
            name: user.name,
            auth_type: account.provider === "google" ? "Google" : "Github",
          },
          update: {
            name: user.name,
            auth_type: account.provider === "google" ? "Google" : "Github",
          },
        });

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
