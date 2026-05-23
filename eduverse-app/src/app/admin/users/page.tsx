"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers(users.filter(u => u._id !== id));
    } else {
      alert('Failed to delete user.');
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditFormData({ name: user.name, role: user.role });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: editingUser._id, ...editFormData })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map(u => u._id === updated._id ? updated : u));
        setShowEditModal(false);
      } else {
        alert('Failed to update user.');
      }
    } catch (error) {
      alert('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-overview-wrapper">
      <div className="admin-courses-header">
        <div>
          <h1>Manage Users</h1>
          <p>View all registered students and administrators.</p>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#6c5ce7' }}></i>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0' }}>
            <p>No users found in the database.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#a0aec0' }}>{user.email}</div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: user.role === 'admin' ? 'rgba(108, 92, 231, 0.2)' : user.role === 'mentor' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(45, 212, 191, 0.2)',
                      color: user.role === 'admin' ? '#a29bfe' : user.role === 'mentor' ? '#fbbf24' : '#2dd4bf'
                    }}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: '#a0aec0' }}>
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.875rem' }}>Active</span>
                  </td>
                  <td>
                    <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                      {user.role !== 'admin' ? (
                        <>
                          <button onClick={() => openEditModal(user)} className="edit" title="Edit User">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="delete" title="Delete User">
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Edit User</h2>
              <button type="button" className="admin-modal-close" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name *</label>
                <input required type="text" className="admin-input" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} placeholder="User's name" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Role *</label>
                <select required className="admin-input" value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: '#6c5ce7', color: 'white', border: 'none', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
