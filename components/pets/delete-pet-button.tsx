"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeletePetButtonProps = {
  petId: string;
  petName: string;
};

export function DeletePetButton({ petId, petName }: DeletePetButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const { error } = await supabase.from("pets").delete().eq("id", petId);
    console.log("delete pet", { petId, error });

    setIsDeleting(false);

    if (error) {
      toast.error("No se pudo eliminar la mascota", {
        description: "Ocurrió un error al eliminar en la base de datos.",
      });
      return;
    }

    setOpen(false);

    toast.success("Mascota eliminada correctamente", {
      description: `${petName} fue eliminada del cliente.`,
    });

    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Eliminar mascota {petName}</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar mascota</AlertDialogTitle>
          <AlertDialogDescription className="leading-6">
            ¿Seguro que deseas eliminar a <strong>{petName}</strong>? Esta
            acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
