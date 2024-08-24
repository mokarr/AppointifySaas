/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: './src/models/Schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres.gdyoqutidqeeszjkvtxo:RZh*DiYd@KEV3km@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  },
  verbose: true,
  strict: true,
});
