export const TEST_EMAIL = process.env.E2E_LOGIN_EMAIL ?? "";
export const TEST_PASSWORD = process.env.E2E_LOGIN_PASSWORD ?? "";

export function assertTestCredentials() {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error(
      "Faltan E2E_LOGIN_EMAIL y/o E2E_LOGIN_PASSWORD en las variables de entorno.",
    );
  }
}
