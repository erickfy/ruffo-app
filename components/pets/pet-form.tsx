"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { petSchema, type PetFormValues } from "@/lib/validations/pet";
import { showFormErrorsToast } from "@/lib/forms/show-form-errors-toast";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PetFormProps = {
  clientId: string;
};

export function PetForm({ clientId }: PetFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "canino",
      breed: "",
      behavior_notes: "",
    },
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: PetFormValues) {
    const payload = {
      client_id: clientId,
      name: values.name.trim(),
      species: values.species,
      breed: values.breed?.trim() ? values.breed.trim() : null,
      behavior_notes: values.behavior_notes?.trim()
        ? values.behavior_notes.trim()
        : null,
    };

    const { error } = await supabase.from("pets").insert(payload);

    if (error) {
      form.setError("root", {
        type: "server",
        message: "No se pudo registrar la mascota. Intenta nuevamente.",
      });

      toast.error("No se pudo registrar la mascota", {
        description: "Ocurrió un error al guardar en la base de datos.",
      });

      return;
    }

    toast.success("Mascota registrada correctamente", {
      description: "La mascota fue asociada al cliente.",
    });

    router.push(`/clientes/${clientId}`);
    router.refresh();
    // window.location.assign(`/clientes/${clientId}`);
  }

  function onInvalid() {
    showFormErrorsToast(
      form.formState.errors,
      "Revisa los campos de la mascota",
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva mascota</CardTitle>
        <CardDescription>
          Registra una mascota asociada a este cliente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-5"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Luna"
                      maxLength={50}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Máximo 50 caracteres.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especie *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="canino">Canino</SelectItem>
                      <SelectItem value="felino">Felino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Campo obligatorio.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raza</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Poodle"
                      maxLength={60}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Campo opcional, máximo 60 caracteres.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="behavior_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas de comportamiento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej. Nerviosa al inicio, no le gusta el secador"
                      rows={4}
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Campo opcional, máximo 300 caracteres.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message ? (
              <p className="text-sm text-red-600">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar mascota"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
