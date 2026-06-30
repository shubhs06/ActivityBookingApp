import { useEffect, useState } from 'react';
import { getMyBookings, cancelMyBooking } from '../../api/booking';

const STATUS_LABEL = {
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    getMyBookings()
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelMyBooking(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p className="text-stone text-center py-20">Loading your bookings…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl mb-8">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone">You haven't booked any activities yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="ticket-stub">
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg">{b.activity?.name}</h3>
                  <span className={`status-badge status-${b.status}`}>{STATUS_LABEL[b.status]}</span>
                </div>
                <div className="font-mono text-sm text-stone flex items-center gap-3">
                  <span>{new Date(b.slot?.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span className="w-1 h-1 rounded-full bg-stone/50" />
                  <span>{b.slot?.startTime} – {b.slot?.endTime}</span>
                </div>
                {b.status === 'cancelled' && b.cancelledReason && (
                  <p className="text-sm text-red-500 mt-2">Reason: {b.cancelledReason}</p>
                )}
                {b.status === 'pending' && (
                  <p className="text-sm text-amber-600 mt-2">Payment pending — admin will confirm once received.</p>
                )}
              </div>

              <div className="ticket-stub__divider" />

              <div className="px-5 flex items-center justify-center min-w-[140px]">
                {b.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id}
                    className="btn-danger text-sm whitespace-nowrap"
                  >
                    {cancellingId === b._id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
                {b.status === 'confirmed' && (
                  <span className="text-confirmed text-2xl">✓</span>
                )}
                {b.status === 'cancelled' && (
                  <span className="text-stone text-2xl">✕</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
