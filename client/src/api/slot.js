import api from './axios';

export const createSlot = (data) => api.post('/slots', data);
export const updateSlot = (id, data) => api.put(`/slots/${id}`, data);
export const deleteSlot = (id) => api.delete(`/slots/${id}`);
export const getSlotsByActivity = (activityId) => api.get(`/slots/activity/${activityId}`);
