"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get logged in user
    const localUser = JSON.parse(sessionStorage.getItem('eduverse_user') || '{}');
    
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        // Sort by XP descending
        const sorted = data.sort((a: any, b: any) => b.xp - a.xp);
        setUsers(sorted);
        
        // Find current user's rank
        const myRankIndex = sorted.findIndex((u: any) => u.email === localUser.email || u.name === localUser.name);
        if (myRankIndex !== -1) {
          setCurrentUser({ ...sorted[myRankIndex], rank: myRankIndex + 1 });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || users.length < 3) {
    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6c5ce7', fontSize: '1.2rem', fontWeight: 600 }}>Calculating global rankings...</div>
      </div>
    );
  }

  // Format Top 3
  const topStudents = [
    { rank: 1, name: users[0].name, xp: users[0].xp, avatar: users[0].name.charAt(0), color: '#f9ca24', badge: 'Diamond' },
    { rank: 2, name: users[1].name, xp: users[1].xp, avatar: users[1].name.charAt(0), color: '#dcdde1', badge: 'Platinum' },
    { rank: 3, name: users[2].name, xp: users[2].xp, avatar: users[2].name.charAt(0), color: '#e1b12c', badge: 'Gold' },
  ];

  // Rest of rankings (up to 10 for display)
  const rankings = users.slice(3, 13).map((u, i) => ({
    rank: i + 4,
    name: u.name,
    xp: u.xp,
    avatar: u.name.charAt(0)
  }));

  const getPointsNeeded = () => {
    if (!currentUser || currentUser.rank === 1) return 0;
    const target = users[currentUser.rank - 2]; // The person 1 rank above
    return target.xp - currentUser.xp + 1;
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '100px 20px 100px', position: 'relative' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6c5ce7', textDecoration: 'none', marginBottom: '16px', fontWeight: 600 }}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '2.5rem', margin: 0 }}>Global Leaderboard</h1>
            <p style={{ color: '#8892b0', margin: '8px 0 0 0' }}>Compete with peers by earning XP through course completions.</p>
          </div>
          <div style={{ background: 'white', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(108,92,231,0.1)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Season Ends In</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6c5ce7' }}>14d 08h</div>
          </div>
        </div>

        {/* Podium */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', marginBottom: '40px', height: '260px' }}>
          {/* 2nd Place */}
          <div style={{ width: '30%', background: 'white', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', borderTop: `4px solid ${topStudents[1].color}`, height: '80%', position: 'relative', boxShadow: '0 -10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: '-30px', width: '60px', height: '60px', borderRadius: '50%', background: topStudents[1].color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: '4px solid white' }}>{topStudents[1].avatar}</div>
            <h3 style={{ marginTop: '20px', fontSize: '1.1rem', color: '#1a1a2e' }}>{topStudents[1].name}</h3>
            <p style={{ color: '#8892b0', margin: '4px 0 16px 0', fontSize: '0.9rem' }}>{topStudents[1].xp.toLocaleString()} XP</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(220,221,225,0.4)', marginTop: 'auto' }}>2</div>
          </div>
          
          {/* 1st Place */}
          <div style={{ width: '35%', background: 'white', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', borderTop: `4px solid ${topStudents[0].color}`, height: '100%', position: 'relative', boxShadow: '0 -10px 40px rgba(108,92,231,0.1)', zIndex: 10 }}>
            <i className="fas fa-crown" style={{ position: 'absolute', top: '-55px', color: '#f9ca24', fontSize: '2rem', filter: 'drop-shadow(0 4px 10px rgba(249,202,36,0.4))' }}></i>
            <div style={{ position: 'absolute', top: '-30px', width: '70px', height: '70px', borderRadius: '50%', background: topStudents[0].color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', border: '4px solid white' }}>{topStudents[0].avatar}</div>
            <h3 style={{ marginTop: '30px', fontSize: '1.25rem', color: '#1a1a2e' }}>{topStudents[0].name}</h3>
            <p style={{ color: '#8892b0', margin: '4px 0 16px 0', fontSize: '0.9rem', fontWeight: 600 }}>{topStudents[0].xp.toLocaleString()} XP</p>
            <span style={{ padding: '4px 12px', background: 'rgba(249,202,36,0.1)', color: '#e0a800', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Diamond Tier</span>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'rgba(249,202,36,0.1)', marginTop: 'auto' }}>1</div>
          </div>

          {/* 3rd Place */}
          <div style={{ width: '30%', background: 'white', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', borderTop: `4px solid ${topStudents[2].color}`, height: '70%', position: 'relative', boxShadow: '0 -10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: '-30px', width: '60px', height: '60px', borderRadius: '50%', background: topStudents[2].color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: '4px solid white' }}>{topStudents[2].avatar}</div>
            <h3 style={{ marginTop: '20px', fontSize: '1.1rem', color: '#1a1a2e' }}>{topStudents[2].name}</h3>
            <p style={{ color: '#8892b0', margin: '4px 0 16px 0', fontSize: '0.9rem' }}>{topStudents[2].xp.toLocaleString()} XP</p>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(225,177,44,0.2)', marginTop: 'auto' }}>3</div>
          </div>
        </div>

        {/* Table List */}
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(108,92,231,0.08)' }}>
          {rankings.map((student, index) => (
            <div key={student.rank} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: index === rankings.length - 1 ? 'none' : '1px solid rgba(108,92,231,0.04)', transition: 'background 0.2s', background: currentUser?.rank === student.rank ? 'rgba(108,92,231,0.05)' : 'white' }} onMouseEnter={(e) => { if (currentUser?.rank !== student.rank) e.currentTarget.style.background = 'rgba(108,92,231,0.02)' }} onMouseLeave={(e) => { if (currentUser?.rank !== student.rank) e.currentTarget.style.background = 'white' }}>
              <div style={{ width: '40px', fontWeight: 800, color: '#8892b0', fontSize: '1.1rem' }}>#{student.rank}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', color: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '16px' }}>{student.avatar}</div>
              <div style={{ flex: 1, fontWeight: 600, color: '#1a1a2e' }}>{student.name} {currentUser?.rank === student.rank && <span style={{ fontSize: '0.75rem', background: '#6c5ce7', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>YOU</span>}</div>
              <div style={{ fontWeight: 700, color: '#6c5ce7' }}>{student.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>

      </div>

      {/* Sticky Personal Rank Banner */}
      {currentUser && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(17,17,38,0.95)', backdropFilter: 'blur(10px)', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 100 }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#6c5ce7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', border: '2px solid rgba(255,255,255,0.2)' }}>{currentUser.name.charAt(0)}</div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '4px' }}>Your Rank</div>
                <div style={{ fontSize: '1.25rem', color: 'white', fontWeight: 800 }}>#{currentUser.rank} <span style={{ fontSize: '0.9rem', color: '#a0aec0', fontWeight: 500, marginLeft: '8px' }}>{currentUser.name}</span></div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', color: 'white', fontWeight: 800, marginBottom: '4px' }}>{currentUser.xp.toLocaleString()} XP</div>
              {currentUser.rank > 1 && (
                <div style={{ fontSize: '0.85rem', color: '#a0aec0' }}>{getPointsNeeded().toLocaleString()} XP needed to pass #{currentUser.rank - 1}</div>
              )}
              {currentUser.rank === 1 && (
                <div style={{ fontSize: '0.85rem', color: '#f9ca24' }}><i className="fas fa-crown"></i> You are rank #1!</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
