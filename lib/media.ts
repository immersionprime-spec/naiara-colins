import { createServiceRoleClient } from "@/lib/supabase/server";

export type MediaRow = {
  id: string;
  section: string;
  url: string;
  type: string;
  order: number;
  is_primary: boolean;
  signedUrl?: string;
};

export async function getMediaBySection(section: string): Promise<MediaRow[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("media")
      .select("id, section, url, type, order, is_primary")
      .eq("section", section)
      .order("order", { ascending: true });

    if (error || !data) return [];

    // Generate signed URLs
    const withSigned = await Promise.all(
      data.map(async (row) => {
        const { data: signed } = await supabase.storage
          .from("media")
          .createSignedUrl(row.url, 3600);
        return { ...row, signedUrl: signed?.signedUrl ?? "" };
      })
    );

    return withSigned;
  } catch {
    return [];
  }
}

export async function getHeroVideos(): Promise<{
  video1: MediaRow | null;
  video2: MediaRow | null;
}> {
  const videos = await getMediaBySection("hero");
  const primary = videos.find((v) => v.is_primary) ?? videos[0] ?? null;
  const secondary = videos.find((v) => !v.is_primary && v.id !== primary?.id) ?? null;
  return { video1: primary, video2: secondary };
}
