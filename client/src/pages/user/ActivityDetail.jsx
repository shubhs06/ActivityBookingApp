import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById } from '../../api/activity';
import { createBooking } from '../../api/booking';
import SlotTicket from '../../components/SlotTicket';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [message, setMessage] = useState('');

  const loadData = () => {
    getActivityById(id)
      .then((res) => {
        setActivity(res.data.activity);
        setSlots(res.data.slots);
      })
      .catch(() => setError('Could not load this activity.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBook = async (slotId) => {
    setBookingSlotId(slotId);
    setMessage('');
    try {
      await createBooking({ slotId });
      setMessage('success:Booking requested! Check My Bookings to complete payment.');
      loadData();
    } catch (err) {
      setMessage(`error:${err.response?.data?.message || 'Could not book this slot.'}`);
    } finally {
      setBookingSlotId(null);
    }
  };

  if (loading) return <p className="text-stone text-center py-20">Loading…</p>;
  if (error || !activity) return <p className="text-red-600 text-center py-20">{error || 'Activity not found.'}</p>;

  const [type, text] = message.split(':');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-stone hover:text-terracotta mb-6">
        ← Back to activities
      </button>

      <div className="mb-10">
        <h1 className="text-4xl mb-2">{activity.name}</h1>
        <p className="font-mono text-sm text-sage mb-4">{activity.location}</p>
        <p className="text-pine/80 leading-relaxed max-w-2xl">{activity.description}</p>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            type === 'success' ? 'bg-[#E8F3EE] text-confirmed' : 'bg-red-50 text-red-600'
          }`}
        >
          {text}
        </div>
      )}

      <h2 className="text-2xl mb-4">Available slots</h2>

      {slots.length === 0 ? (
        <p className="text-stone">No upcoming slots for this activity yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {slots.map((slot) => {
            const isFull = slot.bookedCount >= slot.capacity;
            return (
              <SlotTicket key={slot._id} slot={slot}>
                <button
                  onClick={() => handleBook(slot._id)}
                  disabled={isFull || bookingSlotId === slot._id}
                  className="btn-primary !px-4 !py-2 text-sm whitespace-nowrap"
                >
                  {bookingSlotId === slot._id ? 'Booking…' : isFull ? 'Full' : 'Book slot'}
                </button>
              </SlotTicket>
            );
          })}
        </div>
      )}
    </div>
  );
}
