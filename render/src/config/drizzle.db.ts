import { SQLocalDrizzle } from 'sqlocal/drizzle';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './note.schema';

let dbDriver: ReturnType<typeof drizzle<typeof schema>>;

if (typeof window !== 'undefined') {
  const { driver } = new SQLocalDrizzle('local.db');
  dbDriver = drizzle(driver, { schema });
}

export {dbDriver};