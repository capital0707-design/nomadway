import { neon } from '@neondatabase/serverless';

// Эта переменная будет подтягиваться из настроек Vercel
export const sql = neon(process.env.DATABASE_URL);