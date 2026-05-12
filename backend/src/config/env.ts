import {config} from 'dotenv';
import zod from 'zod';

config()

const envSchema = zod.object({
    NODE_ENV: zod.enum(['development', 'production', 'test']).default('development'),
    PORT: zod.coerce.number().int().positive().default(3000),
    DATABASE_URL: zod.string().url("DATABASE_URL должен быть валидным"),
    JWT_SECRET: zod.string().min(32, "JWT_SECRET должен быть минимум 32 символа"),
    JWT_ACCESS_EXPIRES_IN: zod.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod.string().default('7d'),
    FRONTEND_URL: zod.string().url().default('http://localhost:5173'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
    console.error("Критическая ошибка: неверные элементы в env");
    console.error(parseResult.error.format());
    process.exit(1);
}

export const env = parseResult.data;

export type EnvConfig = typeof env;

