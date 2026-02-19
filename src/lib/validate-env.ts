import z from 'zod';

export type ValidateEnvOptions<T> = {
  schema: z.ZodType<T>;
  env: T;
  runMode?: string;
  strictValidation?: boolean;
};

export function validateEnv<T>({
  schema,
  env,
  runMode = 'unknown',
  strictValidation = false,
}: ValidateEnvOptions<T>): T {
  const parsed = schema.safeParse(env);

  if (parsed.success === false) {
    const errorMessage
      = `❌ Invalid environment variables:${
        JSON.stringify(z.flattenError(parsed.error).fieldErrors, null, 2)
      }\n❌ Missing variables in .env file for APP_ENV=${runMode}`
      + `\n💡 Tip: If you recently updated the .env file, try restarting with -c flag to clear the cache.`;

    if (strictValidation) {
      console.error(errorMessage);
      throw new Error('Invalid environment variables');
    }
  }
  else {
    console.log('✅ Environment variables validated successfully');
  }

  return parsed.success ? parsed.data : env;
}
