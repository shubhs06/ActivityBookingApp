import api from './axios';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');
export const cancelMyBooking = (id) => api.patch(`/bookings/cancel/${id}`);

export const getAllBookings = (status) =>
  api.get('/bookings/all', { params: status ? { status } : {} });
export const confirmBooking = (id, paymentReference) =>
  api.patch(`/bookings/confirm/${id}`, { paymentReference });
export const adminCancelBooking = (id, reason) =>
  api.patch(`/bookings/admin-cancel/${id}`, { reason });
