import { Request, Response } from "express";
import 'http';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

declare module 'http' {
    interface IncomingMessage {
        cookies?: { [key: string]: string };
    }
}