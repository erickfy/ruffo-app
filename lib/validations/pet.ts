import { z } from "zod";

export const petSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(50, "El nombre no puede superar los 50 caracteres.")
    .regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s'.-]+$/,
      "El nombre contiene caracteres no permitidos.",
    ),

  species: z.enum(["canino", "felino", "otro"], {
    error: "Debes seleccionar una especie válida.",
  }),

  breed: z
    .string()
    .trim()
    .max(60, "La raza no puede superar los 60 caracteres.")
    .optional()
    .or(z.literal("")),

  behavior_notes: z
    .string()
    .trim()
    .max(
      300,
      "Las notas de comportamiento no pueden superar los 300 caracteres.",
    )
    .optional()
    .or(z.literal("")),
});

export type PetFormValues = z.infer<typeof petSchema>;
