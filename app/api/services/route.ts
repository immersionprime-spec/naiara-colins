import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type ServiceRow = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
};

export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, category, name, description, icon, order")
      .eq("active", true)
      .order("order", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Conexão instável. Tente novamente." },
        { status: 500 }
      );
    }

    const grouped: Record<
      "hair" | "nail" | "estetica",
      Omit<ServiceRow, "category" | "order">[]
    > = {
      hair: [],
      nail: [],
      estetica: [],
    };

    for (const row of (data ?? []) as ServiceRow[]) {
      if (row.category !== "hair" && row.category !== "nail" && row.category !== "estetica") {
        continue;
      }
      const cat = row.category;
      grouped[cat].push({
        id: row.id,
        name: row.name,
        description: row.description,
        icon: row.icon,
      });
    }

    return NextResponse.json(grouped);
  } catch {
    return NextResponse.json(
      { error: "Conexão instável. Tente novamente." },
      { status: 500 }
    );
  }
}
