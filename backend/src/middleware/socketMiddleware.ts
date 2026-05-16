import {Socket} from "socket.io";
import {MiddlewareNext} from "@/types/socket.types.ts";
import {verifyToken} from "@/utils/jwt.ts";
import {prisma} from "@/prismaClient.ts";


export default async function socketMiddleware(socket: Socket, next: MiddlewareNext) {
    try {
        const cookies = socket.request.cookies;
        if (!cookies) {
            return next(new Error("Cookie not found"));
        }
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            return next(new Error("Authentication required"));
        }
        const decoded = verifyToken(accessToken);
        const userId = decoded.userId;

        const user = await prisma.user.findFirst({
            where: {id: userId},
            select: {id: true},
        })
        if (!user) {
            return new Error("User not found");
        }

        next();
    } catch (error) {
        console.error(`socketMiddleware error: ${error}`);
    }
}