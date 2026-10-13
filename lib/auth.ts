import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoClient, mongoDb } from "@/lib/mongodb";

const defaultAppUrl = "http://localhost:3000";
const configuredAppUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  process.env.BETTER_AUTH_URL?.trim() ||
  defaultAppUrl;
const baseURL = process.env.BETTER_AUTH_URL?.trim() || configuredAppUrl;

function getOrigin(value: string, variableName: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be an absolute HTTP or HTTPS URL.`);
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      `${variableName} must be an absolute HTTP or HTTPS URL without credentials.`,
    );
  }

  return url.origin;
}

function getSocialProvider(
  clientId: string | undefined,
  clientSecret: string | undefined,
  provider: string,
) {
  const id = clientId?.trim();
  const secret = clientSecret?.trim();
  if (Boolean(id) !== Boolean(secret)) {
    throw new Error(
      `Configure both the ${provider} client ID and client secret, or leave both unset.`,
    );
  }
  return id && secret ? { clientId: id, clientSecret: secret } : undefined;
}

const appOrigin = getOrigin(
  configuredAppUrl,
  "NEXT_PUBLIC_APP_URL or BETTER_AUTH_URL",
);
const authOrigin = getOrigin(baseURL, "BETTER_AUTH_URL");
const authSecret = process.env.BETTER_AUTH_SECRET?.trim();
if (
  process.env.NODE_ENV === "production" &&
  (!authSecret || authSecret.length < 32)
) {
  throw new Error(
    "Set BETTER_AUTH_SECRET to a random value of at least 32 characters in production.",
  );
}

const google = getSocialProvider(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "Google",
);
const github = getSocialProvider(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  "GitHub",
);

const disableTransactions =
  process.env.MONGODB_DISABLE_TRANSACTIONS?.trim().toLowerCase() ?? "false";
if (disableTransactions !== "true" && disableTransactions !== "false") {
  throw new Error("MONGODB_DISABLE_TRANSACTIONS must be either true or false.");
}

const mongoDatabase =
  mongoClient && mongoDb
    ? disableTransactions === "true"
      ? mongodbAdapter(mongoDb)
      : mongodbAdapter(mongoDb, { client: mongoClient })
    : undefined;

export const auth = betterAuth({
  appName: "বাজার দর",
  baseURL,
  secret:
    authSecret || "development-only-change-me-before-deploying-32-characters",
  ...(mongoDatabase ? { database: mongoDatabase } : {}),
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    ...(google ? { google } : {}),
    ...(github ? { github } : {}),
  },
  trustedOrigins: [...new Set([appOrigin, authOrigin])],
});
