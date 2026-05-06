"use client";

import { useEffect, useState } from "react";

export type MediaItem = {
  id: string;
  section: string;
  url: string;
  type: string;
  order: number;
  is_primary: boolean;
  signedUrl: string;
  posterUrl?: string;
};

export function useMedia(section: string) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/media/section/${section}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setItems(data ?? []); })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [section]);

  return { items, loading };
}
