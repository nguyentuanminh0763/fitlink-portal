import axiosClient from "../api/axiosClient";

export async function uploadMaterialFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post("/pt/materials/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
