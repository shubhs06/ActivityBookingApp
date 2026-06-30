import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllActivities, createActivity, deleteActivity } from '../../api/activity';

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', location: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    getAllActivities()
      .then((res) => setActivities(res.data.activities))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createActivity(form);
      setForm({ name: '', description: '', location: '', imageUrl: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create activity.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this activity? It will no longer be visible to users.')) return;
    try {
      await deleteActivity(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not deactivate activity.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-xs text-terracotta tracking-widest uppercase mb-2">Admin</p>
          <h1 className="text-4xl">Activities</h1>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          {showForm ? 'Close' : '+ New activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 mb-10 border border-pine/5 flex flex-col gap-4 max-w-xl">
          {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1.5">Activity name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Sunrise Trek" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field" placeholder="What does this activity involve?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required className="input-field" placeholder="Lonavala, Maharashtra" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Image URL (optional)</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input-field" placeholder="https://…" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary self-start">
            {saving ? 'Creating…' : 'Create activity'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-stone">Loading…</p>
      ) : activities.length === 0 ? (
        <p className="text-stone">No activities yet. Create your first one above.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pine/5">
              <div className="p-5">
                <h3 className="text-xl mb-1">{activity.name}</h3>
                <p className="text-stone text-sm mb-3 line-clamp-2">{activity.description}</p>
                <p className="font-mono text-xs text-sage mb-4">{activity.location}</p>
                <div className="flex gap-2">
                  <Link to={`/admin/activities/${activity._id}/slots`} className="btn-secondary text-sm !py-1.5 !px-3 flex-1 text-center">
                    Manage slots
                  </Link>
                  <button onClick={() => handleDelete(activity._id)} className="btn-danger text-sm !py-1.5 !px-3">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
