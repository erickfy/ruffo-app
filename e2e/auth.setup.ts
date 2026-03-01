import { test as setup, expect } from "@playwright/test";
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  assertTestCredentials,
} from "./utils/test-credentials";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  assertTestCredentials();

  await page.goto("/login");

  await page.getByLabel(/correo electrónico/i).fill(TEST_EMAIL);
  await page.locator("#password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /ingresar/i }).click();

  const inlineError = page.locator(
    "div.rounded-2xl.border.border-red-200.bg-red-50",
  );

  await Promise.race([
    page.waitForURL("**/clientes", { timeout: 8000 }),
    inlineError.waitFor({ state: "visible", timeout: 8000 }),
  ]);

  const currentUrl = page.url();

  if (currentUrl.endsWith("/login")) {
    await page.screenshot({
      path: "playwright/.auth/login-failed.png",
      fullPage: true,
    });

    if (await inlineError.isVisible()) {
      const errorText = await inlineError.textContent();

      throw new Error(
        `El login E2E falló. Revisa E2E_LOGIN_EMAIL/E2E_LOGIN_PASSWORD en .env.local. Usuario usado: ${TEST_EMAIL}. Mensaje mostrado: ${errorText}`,
      );
    }

    throw new Error(
      `El login E2E no redirigió a /clientes y tampoco mostró el mensaje esperado. URL actual: ${currentUrl}`,
    );
  }

  await expect(page).toHaveURL(/\/clientes$/);
  await page.context().storageState({ path: authFile });
});
