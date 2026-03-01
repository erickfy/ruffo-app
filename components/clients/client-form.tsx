"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { clientSchema, type ClientFormValues } from "@/lib/validations/client";
import { showFormErrorsToast } from "@/lib/forms/show-form-errors-toast";

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

export function ClientForm() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      notes: "",
    },
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ClientFormValues) {
    const payload = {
      full_name: values.full_name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() ? values.email.trim() : null,
      notes: values.notes?.trim() ? values.notes.trim() : null,
    };

    const { data, error } = await supabase
      .from("clients")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      form.setError("root", {
        type: "server",
        message: "No se pudo crear el cliente. Intenta nuevamente.",
      });

      toast.error("No se pudo crear el cliente", {
        description: "Ocurrió un error al guardar en la base de datos.",
      });

      return;
    }

    toast.success("Cliente creado correctamente", {
      description: "El cliente fue registrado con éxito.",
    });

    router.push(`/clientes/${data.id}`);
  }

  function onInvalid() {
    showFormErrorsToast(form.formState.errors, "Revisa los campos del cliente");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo cliente</CardTitle>
        <CardDescription>
          Completa los datos requeridos para registrar un cliente.
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
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. María Pérez"
                      maxLength={80}
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Solo letras, espacios y signos básicos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. 0991234567"
                      inputMode="numeric"
                      maxLength={15}
                      autoComplete="tel"
                      {...field}
                      onChange={(e) => {
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        field.onChange(onlyDigits);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Solo números, entre 7 y 15 dígitos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ej. cliente@correo.com"
                      maxLength={120}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Campo opcional. Debe ser un correo válido si se completa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales del cliente"
                      rows={4}
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Máximo 300 caracteres.</FormDescription>
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
              {isSubmitting ? "Guardando..." : "Guardar cliente"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
