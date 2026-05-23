"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f23' }}>
        <h2 style={{ color: 'white' }}>Loading Analytics...</h2>
      </div>
    );
  }

  const PIE_COLORS = ['#6c5ce7', '#00b894', '#38bdf8', '#f59e0b', '#ff6b6b'];

  return (
    <div style={{ background: '#0f0f23', minHeight: '100vh', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <Link href="/admin" style={{ color: '#a0aec0', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.9rem' }}>
              <i className="fas fa-arrow-left"></i> Back to Admin
            </Link>
            <h1 style={{ color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', margin: 0 }}>Revenue Analytics</h1>
            <p style={{ color: '#a0aec0', marginTop: '8px' }}>Track your platform's performance and growth metrics.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { title: 'Total Revenue', value: `$${data.kpis.totalRevenue.toLocaleString()}`, icon: 'fa-dollar-sign', color: '#6c5ce7', growth: `+${data.kpis.revenueGrowth}%` },
            { title: 'Total Students', value: data.kpis.totalStudents.toLocaleString(), icon: 'fa-users', color: '#00b894', growth: `+${data.kpis.studentGrowth}%` },
            { title: 'Active Courses', value: data.kpis.totalCourses, icon: 'fa-book-open', color: '#38bdf8', growth: '+3' },
            { title: 'Avg. Rating', value: data.kpis.avgRating, icon: 'fa-star', color: '#f59e0b', growth: '+0.2' },
          ].map((kpi, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '28px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: kpi.color, opacity: 0.06 }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${kpi.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`fas ${kpi.icon}`} style={{ color: kpi.color, fontSize: '18px' }}></i>
                </div>
                <span style={{ color: '#a0aec0', fontSize: '0.9rem', fontWeight: 500 }}>{kpi.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '2rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{kpi.value}</h2>
                <span style={{ color: '#00b894', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  <i className="fas fa-arrow-up" style={{ fontSize: '0.7rem', marginRight: '4px' }}></i>{kpi.growth}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Revenue + Enrollments */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Revenue Chart */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '10px', color: '#6c5ce7' }}></i>
              Monthly Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#a0aec0" tick={{ fontSize: 12 }} />
                <YAxis stroke="#a0aec0" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  labelStyle={{ color: '#a0aec0' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6c5ce7" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
              <i className="fas fa-chart-pie" style={{ marginRight: '10px', color: '#00b894' }}></i>
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.categoryBreakdown.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
                <Legend iconType="circle" wrapperStyle={{ color: '#a0aec0', fontSize: '0.85rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2: Enrollments Bar Chart */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: 'white', marginTop: 0, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#38bdf8' }}></i>
            Monthly Enrollments
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#a0aec0" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a0aec0" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                labelStyle={{ color: '#a0aec0' }}
              />
              <Bar dataKey="enrollments" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses Table */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
          <h3 style={{ color: 'white', marginTop: 0, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            <i className="fas fa-trophy" style={{ marginRight: '10px', color: '#f59e0b' }}></i>
            Top Performing Courses
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: '#a0aec0', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '14px 16px', color: '#a0aec0', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Course Name</th>
                  <th style={{ textAlign: 'right', padding: '14px 16px', color: '#a0aec0', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Revenue</th>
                  <th style={{ textAlign: 'right', padding: '14px 16px', color: '#a0aec0', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Students</th>
                  <th style={{ textAlign: 'right', padding: '14px 16px', color: '#a0aec0', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.topCourses.map((course: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px', color: '#a0aec0', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${PIE_COLORS[i]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fas fa-book" style={{ color: PIE_COLORS[i], fontSize: '14px' }}></i>
                        </div>
                        <span style={{ color: 'white', fontWeight: 500 }}>{course.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#00b894', fontWeight: 700 }}>${course.revenue.toLocaleString()}</td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#a0aec0' }}>{course.students}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
                        <i className="fas fa-star" style={{ fontSize: '0.7rem', marginRight: '4px' }}></i>{course.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Responsive override */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
