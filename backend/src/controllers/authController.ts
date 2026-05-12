import {Request, Response} from "express";
import {prisma} from "../prismaClient.ts";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body as { email?: string; password?: string };
        if (!email || !password) {
            res.status(400).json({message: "email и password обязательны"});
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: {email},
        })

        if (existingUser) {
            res.status(409).json({message: "Пользователь уже существует"});
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                username: "user",
                role: "user",
                password: passwordHash,
                deletedAt: null,
            },
            select: {
                id: true,
            },
        });

        // const accessToken = createAccessToken({userId: newUser.id});
        // const refreshToken = createRefreshToken({userId: newUser.id});

        const updatedUser = await prisma.user.update({
            where: {id: newUser.id},
            data: {
                username: `user-${newUser.id}`,
                // refresh_token: refreshToken,
            },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                createdAt: true,
            },
        });
        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     secure: false,
        //     maxAge: 15 * 60 * 1000
        // });
        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     sameSite: "lax",
        //     secure: false,
        //     path: "/api/auth/refresh-token",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        res.status(201).json({message: "User successfully created", user: updatedUser, error: null});
    } catch (error) {
        const {email} = req.body as { email?: string };

        const errorUser = await prisma.user.findFirst({
            where: {email},
            select: {
                id: true,
            }
        })
        if (errorUser) {
            await prisma.user.delete({
                where: {id: errorUser.id}
            })
        }
        console.error("Error in register:", error);
        res.status(500).json({message: "Internal server error", error: (error as Error).message});
    }
}