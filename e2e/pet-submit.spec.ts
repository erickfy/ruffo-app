import { test, expect, Page } from "@playwright/test";

function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function createClient(page: Page) {
  const suffix = uniqueSuffix();

  const client = {
    fullName: "Cliente Prueba Ruffo",
    phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
    email: `cliente.e2e.${suffix}@example.com`,
    notes: `Notas E2E ${suffix}`,
  };

  await page.goto("/clientes/nuevo");

  await expect(page).toHaveURL(/\/clientes\/nuevo$/);
  await expect(page.locator('input[name="full_name"]')).toBeVisible();
  await expect(page.locator('input[name="phone"]')).toBeVisible();

  await page.locator('input[name="full_name"]').fill(client.fullName);
  await page.locator('input[name="phone"]').fill(client.phone);
  await page.locator('input[name="email"]').fill(client.email);
  await page.locator('textarea[name="notes"]').fill(client.notes);

  await page.getByRole("button", { name: /guardar cliente/i }).click();

  await page.waitForURL(
    (url) =>
      /\/clientes\/[^/]+$/.test(url.toString()) &&
      !url.toString().endsWith("/clientes/nuevo"),
    { timeout: 15000 },
  );

  const currentUrl = page.url();
  const match = currentUrl.match(/\/clientes\/([^/]+)$/);

  if (!match || match[1] === "nuevo") {
    throw new Error(
      `No se pudo extraer un id válido del cliente. URL actual: ${currentUrl}`,
    );
  }

  return {
    id: match[1],
    ...client,
  };
}

test("permite registrar una mascota asociada a un cliente", async ({
  page,
}) => {
  const client = await createClient(page);

  const suffix = uniqueSuffix();
  const pet = {
    name: "Luna Prueba",
    breed: "Poodle",
    behaviorNotes: `Comportamiento E2E ${suffix}`,
  };

  await page.goto(`/clientes/${client.id}/mascotas/nuevo`);

  await expect(page).toHaveURL(
    new RegExp(`/clientes/${client.id}/mascotas/nuevo$`),
    { timeout: 15000 },
  );

  const form = page.locator("form");
  await expect(form).toBeVisible();

  const textboxes = form.getByRole("textbox");
  await expect(textboxes.nth(0)).toBeVisible();

  await textboxes.nth(0).fill(pet.name);
  await textboxes.nth(1).fill(pet.breed);
  await textboxes.nth(2).fill(pet.behaviorNotes);

  await page.getByRole("button", { name: /guardar mascota/i }).click();

  await expect(page).toHaveURL(new RegExp(`/clientes/${client.id}$`), {
    timeout: 15000,
  });

  await expect(page.getByText(pet.name)).toBeVisible();
});
