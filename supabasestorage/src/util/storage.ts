// reuseable storage
import { supabase } from "@/lib/supabaseClient";

// to upload a file
export const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("avatars2")
    .upload(`public/${file.name}`, file, { upsert: true });

  console.log("Data is ", data);

  if (error) throw error;
  return data?.path;
};

// to get public url
export const getPublicUrl = (path: string) => {
  return supabase.storage.from("avatars2").getPublicUrl(path).data.publicUrl;
};

// to get single url
export const getSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("avatars2")
    .createSignedUrl(path, 60); // 60s expiration

  if (error) throw error;
  return data?.signedUrl;
};

// to get list files url
export const listFiles = async () => {
  const { data, error } = await supabase.storage
    .from("avatars2")
    .list("public", { limit: 100 });

  if (error) throw error;
  return data;
};

// to delete a file
export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("avatars2")
    .remove([path]);
  console.log("Data of deleted items", data);

  if (error) throw error;
  return data;
};
