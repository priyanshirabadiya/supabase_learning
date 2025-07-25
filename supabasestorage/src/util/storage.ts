// reuseable storage
import { supabase } from "@/lib/supabaseClient";

// const {
//   data: { user },
//   error,
// } = await supabase.auth.getUser();
// console.log("User info:", user);

// for avatars2 upload file without any authorization
// const { data, error } = await supabase.storage
//   .from("avatars2")
//   .upload(`public/${file.name}`, file, { upsert: true });
// console.log("Data is ", data);
// if (error) throw error;

// upload a file
// ✅ Uploads file to a user-specific folder inside "avatar" bucket
export const uploadFile = async (file: File) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not logged in");
    throw new Error("Not logged in");
  }
  // 02c7c131-d4b1-49bc-800a-b13efc7f8571
  // private/02c7c131-d4b1-49bc-800a-b13efc7f8571
  const userId = user.id;
  const filePath = `private/${userId}/${file.name}`; // 👈 folder path must match RLS policy

  console.log("👤 Logged in as:", userId);
  console.log("📤 Uploading file to:", filePath);

  const { data, error } = await supabase.storage
    .from("avatar")
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    console.error("❌ Upload failed:", error.message);
    throw error;
  }

  console.log("✅ Uploaded successfully:", data?.path);
  return data?.path;
};

// to get public url
export const getPublicUrl = (path: string) => {
  return supabase.storage.from("avatar").getPublicUrl(path).data.publicUrl;
};

// to get single url
export const getSignedUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("avatar")
    .createSignedUrl(path, 60); // 60s expiration

  if (error) throw error;
  return data?.signedUrl;
};

// to get list files url
export const listFiles = async () => {
  const { data, error } = await supabase.storage
    .from("avatar")
    .list("public", { limit: 100 });

  if (error) throw error;
  return data;
};

// to delete a file
export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage.from("avatar").remove([path]);
  console.log("Data of deleted items", data);

  if (error) throw error;
  return data;
};
