import jwt, {JwtPayload} from "jsonwebtoken";
import { env } from "@/config/env.ts"

const jwtSecret = env.JWT_SECRET;
const accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
const refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;

export const createAccessToken = (payload: { userId: string }): string => {
    return jwt.sign(payload, jwtSecret, {expiresIn: accessExpiresIn});
};

export const createRefreshToken = (payload: { userId: string, sessionId: string }): string => {
    return jwt.sign(payload, jwtSecret, {expiresIn: refreshExpiresIn});
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, jwtSecret) as JwtPayload;
};