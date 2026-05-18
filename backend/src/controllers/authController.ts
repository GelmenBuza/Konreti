import { Request, Response } from "express";
import { prisma } from "../prismaClient.ts";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken, verifyToken } from "@/utils/jwt.ts";

const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body as { email?: string; password?: string; fullName?: string };
        if (!email || !password || !fullName) {
            res.status(400).json({ message: "email, password и fullName обязательны" });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: { email },
        })

        if (existingUser) {
            res.status(409).json({ message: "Пользователь уже существует" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                fullName,
                hashedPassword: passwordHash,
            },
            select: {
                id: true,
            },
        });

        res.status(201).json({ message: "User successfully created", error: null });
    } catch (error) {
        const { email } = req.body as { email?: string };

        const errorUser = await prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
            }
        })
        if (errorUser) {
            await prisma.user.delete({
                where: { id: errorUser.id }
            })
        }
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal server error", error: (error as Error).message });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            res.status(400).json({ message: "Почта и пароль обязательны." })
            return;
        }

        const userPassword = await prisma.user.findFirst({
            where: { email },
            select: {
                hashedPassword: true,
            }
        });

        if (!userPassword) {
            res.status(401).json({ message: "Неверная почта или пароль." })
            return;
        }

        const isValidPassword = await bcrypt.compare(password, userPassword.hashedPassword)
        if (!isValidPassword) {
            res.status(401).json({ message: "Неверная почта или пароль." })
            return;
        }

        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
            }
        })

        if (!user) {
            console.error("Ошибка при поиске пользователя")
            return;
        }

        const accessToken = createAccessToken({ userId: user.id })
        let refreshToken = req.cookies.refreshToken || "";
        
        if (refreshToken) {
            const decoded = verifyToken(refreshToken);

            const session = await prisma.sessions.findUnique({
                where: { id: decoded.sessionId },

                select: {
                    isActive: true,
                },
            });

            if (session && !session.isActive) {
                res.status(403).json({ message: "Forbidden." })
                return;
            } else if (!session) {

                const session = await prisma.sessions.create({
                    data: { isActive: true },
                    select: {
                        id: true,
                    }
                })

                refreshToken = createRefreshToken({ userId: user.id, sessionId: session.id })

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 15 * 60 * 1000
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                res.json({ message: "Логин успешен.", user, error: null });

                return

            } else {
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 15 * 60 * 1000
                })
                res.json({ message: "Логин успешен.", user, error: null });
                return;
            }
        }

        const session = await prisma.sessions.create({
            data: { isActive: true },
            select: {
                id: true,
            }
        })


        refreshToken = createRefreshToken({ userId: user.id, sessionId: session.id })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "Логин успешен.", user, error: null })
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const decoded = verifyToken(refreshToken);

        await prisma.sessions.update({
            where: { id: decoded.sessionId },
            data: { isActive: false },
        })

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(204).send()
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "Не авторизован" });
            return;
        }
        const decoded = verifyToken(refreshToken);
        const user = await prisma.user.findFirst({
            where: { id: decoded.userId },
        });
        if (!user) {
            res.status(401).json({ message: "Пользователя не существует" })
            return;
        }

        const accessToken = createAccessToken({ userId: user.id });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 15 * 60 * 1000
        })
        res.status(200).json({ message: "Token refreshed" })
    } catch (error) {
        console.error("Error in refreshToken:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { login, logout, refreshToken, register }