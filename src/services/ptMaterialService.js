import axiosClient from "../api/axiosClient";

export async function getMyMaterials(params = {}) {
  const res = await axiosClient.get("/pt/materials", { params });
  return res.data;
}

export async function createMaterial(payload) {
  const res = await axiosClient.post("/pt/materials", payload);
  return res.data;
}

export async function updateMaterial(id, payload) {
  const res = await axiosClient.put(`/pt/materials/${id}`, payload);
  return res.data;
}

export async function deleteMaterial(id) {
  const res = await axiosClient.delete(`/pt/materials/${id}`);
  return res.data;
}

export async function shareMaterial(id, packageIds) {
  const res = await axiosClient.post(`/pt/materials/${id}/share`, { packageIds });
  return res.data;
}
