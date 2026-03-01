import { z } from "zod";

export const clientSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "El nombre completo debe tener al menos 3 caracteres.")
    .max(80, "El nombre completo no puede superar los 80 caracteres.")
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/,
      "El nombre solo puede contener letras, espacios, apóstrofes, puntos y guiones.",
    ),

  phone: z
    .string()
    .trim()
    .min(7, "El teléfono debe tener al menos 7 dígitos.")
    .max(15, "El teléfono no puede superar los 15 dígitos.")
    .regex(/^\d+$/, "El teléfono solo puede contener números."),

  email: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .email("Ingresa un correo electrónico válido.")
        .max(120, "El email no puede superar los 120 caracteres."),
    ])
    .transform((value) => value.trim()),

  notes: z
    .string()
    .trim()
    .max(300, "Las notas no pueden superar los 300 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
