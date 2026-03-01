"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    const toastId = toast.loading("Cerrando sesión...", {
      description: "Estamos saliendo de Ruffo App.",
    });

    const { error } = await supabase.auth.signOut({ scope: "local" });

    setIsLoading(false);

    if (error) {
      toast.error("No se pudo cerrar la sesión", {
        id: toastId,
        description: "Intenta nuevamente en unos segundos.",
      });
      return;
    }

    toast.success("Sesión cerrada correctamente", {
      id: toastId,
      description: "Hasta pronto. Tu sesión se cerró con éxito.",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-xl"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cerrando...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </>
      )}
    </Button>
  );
}
