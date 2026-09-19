import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { compressImage, blobToDataURL } from "./imageUtils";

const LOCAL_KEY = "wmnavi-old-machines";

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(list) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
}

export async function listOldMachines(user) {
  if (isSupabaseConfigured && user) {
    const { data, error } = await supabase
      .from("old_machines")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      width_mm: row.width_mm,
      depth_mm: row.depth_mm,
      height_mm: row.height_mm,
      tap: row.tap,
      photo: row.photo_url,
      createdAt: row.created_at,
    }));
  }
  return readLocal();
}

export async function saveOldMachine(user, machine, photoFile) {
  let photoUrl = machine.photo || null;

  if (photoFile) {
    const compressed = await compressImage(photoFile);
    if (isSupabaseConfigured && user) {
      const path = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("old-machine-photos")
        .upload(path, compressed, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("old-machine-photos").getPublicUrl(path);
      photoUrl = data.publicUrl;
    } else {
      photoUrl = await blobToDataURL(compressed);
    }
  }

  const record = {
    name: machine.name || "",
    width_mm: machine.width_mm || null,
    depth_mm: machine.depth_mm || null,
    height_mm: machine.height_mm || null,
    tap: machine.tap || "unknown",
  };

  if (isSupabaseConfigured && user) {
    const { data, error } = await supabase
      .from("old_machines")
      .insert({ ...record, photo_url: photoUrl, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      width_mm: data.width_mm,
      depth_mm: data.depth_mm,
      height_mm: data.height_mm,
      tap: data.tap,
      photo: data.photo_url,
      createdAt: data.created_at,
    };
  }

  const list = readLocal();
  const saved = {
    id: crypto.randomUUID(),
    ...record,
    photo: photoUrl,
    createdAt: new Date().toISOString(),
  };
  writeLocal([saved, ...list]);
  return saved;
}

export async function deleteOldMachine(user, id) {
  if (isSupabaseConfigured && user) {
    const { error } = await supabase.from("old_machines").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  writeLocal(readLocal().filter((m) => m.id !== id));
}
