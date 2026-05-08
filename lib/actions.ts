"use server";

import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export async function logContactEvent(posadaId: string, contactType: string) {
  try {
    const userAgent = headers().get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const deviceType = result.device.type || "desktop";
    const osName = result.os.name || "Unknown OS";
    const browserName = result.browser.name || "Unknown Browser";

    const { error } = await supabase.from("contact_logs").insert([
      {
        posada_id: posadaId,
        tipo_contacto: contactType,
        user_agent: userAgent,
        device_type: deviceType,
        os: osName,
        browser: browserName,
      },
    ]);

    if (error) throw error;
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error logging contact event:", error);
    return { success: false };
  }
}

export async function createPosada(formData: any) {
  try {
    const { data, error } = await supabase
      .from("posadas")
      .insert([
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          image: formData.image,
          category: formData.category || "General",
          has_power_plant: formData.amenities.includes("planta"),
          has_water_tank: formData.amenities.includes("tanque"),
          has_wifi: formData.amenities.includes("wifi"),
          has_parking: formData.amenities.includes("estacionamiento"),
          is_pet_friendly: formData.amenities.includes("pet"),
          rating: 5.0, // Default for new ones
        },
      ])
      .select();

    if (error) throw error;

    revalidatePath("/explorar");
    revalidatePath("/admin/dashboard");
    
    return { success: true, data };
  } catch (error) {
    console.error("Error creating posada:", error);
    return { success: false, error: "No se pudo publicar la posada." };
  }
}

export async function deletePosada(id: string) {
  try {
    const { error } = await supabase
      .from("posadas")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/explorar");
    revalidatePath("/admin/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting posada:", error);
    return { success: false, error: "No se pudo eliminar la posada." };
  }
}
