import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById } from '../../api/activity';
import { getSlotsByActivity, createSlot, deleteSlot } from '../../api/slot';

export default function AdminSlots() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', capacity: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([getActivityById(id), getSlotsByActivity(id)])
      .then(([actRes, slotRes]) => {
        setActivity(actRes.data.activity);
        setSlots(slotRes.data.slots);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createSlot({ activityId: id, ...form, capacity: Number(form.capacity) });
      setForm({ date: '', startTime: '', endTime: '', capacity: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!confirm('Deactivate this slot?')) return;
    try {
      await deleteSlot(slotId);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not deactivate slot.');
    }
  };

  if (loading) return <p className="text-stone text-center py-20">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/admin')} className="text-sm text-stone hover:text-terracotta mb-6">
        ← Back to activities
      </button>

      <p className="font-mono text-xs text-terracotta tracking-widest uppercase mb-2">Manage slots</p>
      <h1 className="text-4xl mb-10">{activity?.name}</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 mb-10 border border-pine/5 grid sm:grid-cols-2 gap-4 max-w-2xl">
        {error && <div className="sm:col-span-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1.5">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Capacity</label>
          <input type="number" min="1" name="capacity" value={form.capacity} onChange={handleChange} required className="input-field" placeholder="20" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Start time</label>
          <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">End time</label>
          <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required className="input-field" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary self-start sm:col-span-2">
          {saving ? 'Adding…' : 'Add slot'}
        </button>
      </form>

      <h2 className="text-2xl mb-4">All slots</h2>

      {slots.length === 0 ? (
        <p className="text-stone">No slots created yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {slots.map((slot) => (
            <div key={slot._id} className="ticket-stub">
              <div className="p-5">
                <div className="font-mono text-sm text-stone flex items-center gap-3 mb-1">
                  <span>{new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span className="w-1 h-1 rounded-full bg-stone/50" />
                  <span>{slot.startTime} – {slot.endTime}</span>
                </div>
                <span className="text-sm text-sage">
                  {slot.bookedCount} / {slot.capacity} booked
                </span>
                {!slot.isActive && <span className="status-badge status-cancelled ml-2">Inactive</span>}
              </div>
              <div className="ticket-stub__divider" />
              <div className="px-5 flex items-center justify-center min-w-[140px]">
                <button onClick={() => handleDelete(slot._id)} className="btn-danger text-sm whitespace-nowrap">
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
