import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

export const dbDriver = drizzle(process.env.DB_FILE_NAME as string);
