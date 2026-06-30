import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllActivities } from '../../api/activity';

export default function ActivitiesList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllActivities()
      .then((res) => setActivities(res.data.activities))
      .catch(() => setError('Could not load activities. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-xs text-terracotta tracking-widest uppercase mb-2">
          Browse & book
        </p>
        <h1 className="text-4xl">Find your next activity</h1>
      </div>

      {loading && <p className="text-stone">Loading activities…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && activities.length === 0 && (
        <div className="text-center py-20">
          <p className="text-stone">No activities available right now. Check back soon.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Link
            key={activity._id}
            to={`/activities/${activity._id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-pine/5"
          >
            <div className="h-40 bg-sage/10 flex items-center justify-center overflow-hidden">
              {activity.imageUrl ? (
                <img src={activity.imageUrl} alt={activity.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">🏕️</span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-xl mb-1 group-hover:text-terracotta transition-colors">
                {activity.name}
              </h3>
              <p className="text-stone text-sm mb-3 line-clamp-2">{activity.description}</p>
              <p className="font-mono text-xs text-sage">{activity.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
