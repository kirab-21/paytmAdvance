import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import zod from "zod";

const credentialsSchema = zod.object({
    phone: zod.string().refine((value) => /^[0-9]{10}$/.test(value), {
        message: "Phn number must be 10 digit"
    }),
    password: zod.string().min(8, {
        message: "Pass must be at least 8 char long"
    }),
});

// const otpSchema = zod.object({
    
// })

export const authOptions = {
    providers: [
        CredentialsProvider({
            name:'Credentials',
            credentials: {
                phone: {label:"Phn No", type: "text", placeholder:"XXXXXXXXXX", required: true},
                password: {label: "Password", type: "password", required: true}
            },
            async authorize(credentials: any) {
                const parsedCredentials = credentialsSchema.safeParse(credentials);

                if(!parsedCredentials.success) {
                    const errors = parsedCredentials.error.errors.map(err => err.message);
                    throw new Error(errors.join(', '));
                }

                const hashedPassword = await bcrypt.hash(credentials.password,8)
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if(existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if(passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.number
                        }
                    }
                    return null;
                }

                try {
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword
                        }
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
                } catch(e) {
                    console.error(e);
                }

                return null;
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    }
}