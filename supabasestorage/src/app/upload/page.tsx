// app/upload/page.tsx
"use client";
import { useState } from "react";
import {
  uploadFile,
  getSignedUrl,
  listFiles,
  deleteFile,
} from "@/util/storage";

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const path = await uploadFile(file);
      const signedUrl = await getSignedUrl(path!);
      setImageUrl(signedUrl);
      fetchFiles(); // refresh list
    } catch (error: any) {
      alert("Upload failed: " + error.message);
    }
  };

  const fetchFiles = async () => {
    try {
      const fileList = await listFiles();
      setFiles(fileList || []);
    } catch (error) {
      console.error("List failed:", error);
    }
  };

  const handleDelete = async (path: string) => {
    await deleteFile(`public/${path}`);
    fetchFiles();
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Upload Avatar</h2>
      <input type="file" onChange={handleUpload} />

      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" className="w-48 h-48 object-cover" />
      )}

      <hr className="my-6" />

      <button onClick={fetchFiles} className="px-4 py-2 bg-blue-500 text-white rounded">
        List Files
      </button>

      <ul className="space-y-2 mt-4">
        {files.map((file) => (
          <li key={file.name} className="flex justify-between items-center">
            <span>{file.name}</span>
            <button
              onClick={() => handleDelete(file.name)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
