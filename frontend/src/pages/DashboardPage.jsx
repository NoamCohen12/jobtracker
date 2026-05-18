import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../api/axios';
import Layout from '../components/Layout';

const STATUS_COLORS = {
  Sent: 'bg-blue-100 text-blue-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-red-100 text-red-700',
  Offer: 'bg-green-100 text-green-700',
};

const STATUS_BG = {
  Sent: 'bg-blue-500',
  Interview: 'bg-yellow-500',
  Rejected: 'bg-red-500',
  Offer: 'bg-green-500',
};

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildWeeklyData(applications) {
  const map = {};
  applications.forEach((app) => {
    if (!app.dateApplied) return;
    const key = getWeekKey(app.dateApplied);
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([week, count]) => ({ week, count }))
    .slice(-8);
}

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/applications')
      .then(({ data }) => setApplications(data))
      .finally(() => setLoading(false));
  }, []);

  const total = applications.length;
  const byStatus = { Sent: 0, Interview: 0, Rejected: 0, Offer: 0 };
  applications.forEach((a) => { if (byStatus[a.status] !== undefined) byStatus[a.status]++; });
  const responseRate = total > 0 ? Math.round((byStatus.Interview / total) * 100) : 0;
  const weeklyData = buildWeeklyData(applications);

  const stats = [
    { label: 'Total Applications', value: total, icon: '📋', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Sent', value: byStatus.Sent, icon: '📤', color: 'bg-blue-50 text-blue-600' },
    { label: 'Interviews', value: byStatus.Interview, icon: '🤝', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Offers', value: byStatus.Offer, icon: '🎉', color: 'bg-green-50 text-green-600' },
    { label: 'Rejected', value: byStatus.Rejected, icon: '❌', color: 'bg-red-50 text-red-600' },
    { label: 'Response Rate', value: `${responseRate}%`, icon: '📊', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your job search progress</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading...</div>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Status Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-20 text-center ${STATUS_COLORS[status]}`}>
                        {status}
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${STATUS_BG[status]}`}
                          style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly bar chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Applications Per Week</h3>
                {weeklyData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                    No data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
