import {env} from '@/config/env';
import cookieParser from 'cookie-parser';
import express, {Request, Response, NextFunction} from 'express';
import {createServer} from 'http';
import {Server as SocketServer} from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import createHttpError from 'http-errors';
import authMiddleware from '@/middleware/authMiddleware.ts';
import {prisma} from '@/prismaClient.ts'
import authRoutes from "@/routes/authRoutes.ts";
import boardRoutes from '@/routes/boardRoutes.ts'
// import cardRoutes from '@/routes/cardRoutes.ts'
import {registerBoardHandlers} from "@/soket/boardSocket.ts";
import socketMiddleware from "@/middleware/socketMiddleware.ts";


// Инициализация
const app = express();
const httpServer = createServer(app);

// Socket.io
export const io = new SocketServer(httpServer, {
    cors: {
        origin: env.FRONTEND_URL,
        credentials: true,
    },
});

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: 'Too many requests, please try again later.'},
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(cors({origin: env.FRONTEND_URL, credentials: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(limiter);

// Health
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({status: 'ok', timestamp: new Date().toISOString()});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', authMiddleware, boardRoutes);
// app.use('/api/cards', authMiddleware, cardRoutes);


app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(createHttpError(404, 'Route not found'));
});


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    if (createHttpError.isHttpError(err)) {
        res.status(err.statusCode).json({error: err.message});
    } else {
        res.status(500).json({error: 'Internal server error'});
    }
});

// Socket settings
io.engine.use(cookieParser());

io.use(socketMiddleware)

registerBoardHandlers(io)

// Запуск сервера
const startServer = async () => {
    try {
        // Проверка подключения к БД
        await prisma.$connect();
        console.log('Connected to PostgreSQL');

        httpServer.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    httpServer.close(async () => {
        console.log('HTTP server closed');
        await prisma.$disconnect();
        console.log('Database disconnected');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Forced exit after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();