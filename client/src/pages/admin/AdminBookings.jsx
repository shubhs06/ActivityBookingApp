import { useEffect, useState } from 'react';
import { getAllBookings, confirmBooking, adminCancelBooking } from '../../api/booking';

const TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const load = (status) => {
    setLoading(true);
    getAllBookings(status)
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const handleConfirm = async (id) => {
    setActingId(id);
    try {
      await confirmBooking(id);
      load(tab);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not confirm booking.');
    } finally {
      setActingId(null);
    }
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) return;
    setActingId(cancelTarget);
    try {
      await adminCancelBooking(cancelTarget, cancelReason);
      setCancelTarget(null);
      setCancelReason('');
      load(tab);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="font-mono text-xs text-terracotta tracking-widest uppercase mb-2">Admin</p>
      <h1 className="text-4xl mb-8">Booking requests</h1>

      <div className="flex gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-pine text-paper' : 'bg-white text-pine border border-pine/10 hover:bg-pine/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-stone">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-stone">No bookings in this category.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="ticket-stub">
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-2 gap-4">
                  <h3 className="text-lg">{b.activity?.name}</h3>
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                </div>
                <p className="text-sm text-pine/70 mb-1">
                  {b.user?.username} · {b.user?.email} · {b.user?.contactNumber}
                </p>
                <div className="font-mono text-sm text-stone flex items-center gap-3">
                  <span>{new Date(b.slot?.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span className="w-1 h-1 rounded-full bg-stone/50" />
                  <span>{b.slot?.startTime} – {b.slot?.endTime}</span>
                </div>
                {b.cancelledReason && (
                  <p className="text-sm text-red-500 mt-2">Reason: {b.cancelledReason}</p>
                )}

                {cancelTarget === b._id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason for cancelling (e.g. payment not received)"
                      className="input-field text-sm flex-1"
                      autoFocus
                    />
                    <button onClick={submitCancel} disabled={actingId === b._id} className="btn-danger text-sm whitespace-nowrap">
                      Confirm cancel
                    </button>
                    <button onClick={() => { setCancelTarget(null); setCancelReason(''); }} className="btn-secondary text-sm">
                      Back
                    </button>
                  </div>
                )}
              </div>

              {b.status === 'pending' && cancelTarget !== b._id && (
                <>
                  <div className="ticket-stub__divider" />
                  <div className="px-5 flex flex-col items-center justify-center gap-2 min-w-[140px]">
                    <button
                      onClick={() => handleConfirm(b._id)}
                      disabled={actingId === b._id}
                      className="btn-primary text-sm w-full whitespace-nowrap"
                    >
                      {actingId === b._id ? 'Confirming…' : 'Mark paid & confirm'}
                    </button>
                    <button
                      onClick={() => setCancelTarget(b._id)}
                      className="btn-danger text-sm w-full whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
