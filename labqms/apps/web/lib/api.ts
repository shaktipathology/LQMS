import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
});
api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

export interface Session {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export const login = async (email: string, password: string, totp?: string): Promise<Session> => {
  const { data } = await api.post('/auth/login', { email, password, totp });
  if (data.token) {
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
  }
  return data;
};

export const fetchDocuments = async () => {
  const { data } = await api.get('/documents');
  return data;
};

export const fetchRegisters = async () => {
  const { data } = await api.get('/registers');
  return data;
};

export const fetchRegisterEntries = async (id: string) => {
  const { data } = await api.get(`/registers/${id}/entries`);
  return data;
};

export const fetchIqcChart = async (registerId: string, params: Record<string, string>) => {
  const { data } = await api.get(`/iqc/${registerId}/chart`, { params });
  return data;
};

export const fetchEquipment = async () => {
  const { data } = await api.get('/equipment');
  return data;
};

export const fetchOccurrences = async () => {
  const { data } = await api.get('/occurrences');
  return data;
};

export const fetchCapas = async () => {
  const { data } = await api.get('/capas');
  return data;
};

export default api;
