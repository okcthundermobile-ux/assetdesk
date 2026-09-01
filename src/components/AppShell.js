import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import BrandLogo from './BrandLogo';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

const ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  map: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3M20 16V6" />
    </svg>
  ),
  rocket: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 15c5-4 7-8 7-11-3 0-7 2-11 7l-3 1 3 3 1 3 3-3z" />
      <path d="M9 15l-4 4" />
      <circle cx="14" cy="10" r="1.6" />
    </svg>
  ),
  bell: (
    <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
      <path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.3 1a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: '/', icon: ICONS.home, label: 'Home', blurb: 'Season overview' },
  { to: '/schedule', icon: ICONS.calendar, label: 'Game Calendar', blurb: 'Home schedule & activations' },
  { to: '/arena', icon: ICONS.map, label: 'Arena Heatmap', blurb: 'Asset zone map' },
  { to: '/reports', icon: ICONS.chart, label: 'Reports & KPIs', blurb: 'Partner performance' },
  { to: '/deployments', icon: ICONS.rocket, label: 'Deployments', blurb: 'Plan & track activations' },
];

const TITLES = {
  '/': { title: 'Home', sub: 'Season overview and quick actions' },
  '/schedule': { title: 'Game Calendar', sub: 'Home schedule and per-game activation detail' },
  '/arena': { title: 'Arena Heatmap', sub: 'Paycom Center asset zones by partner' },
  '/reports': { title: 'Reports & KPIs', sub: 'Partner performance across the season' },
  '/deployments': { title: 'Deployments', sub: 'Create and manage asset deployments' },
};

export default function AppShell() {
  const { currentUser, userProfile, logout } = useAuth();
  const { curRole, setCurRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const isPartner = userProfile?.partnerID != null;
  const page = TITLES[location.pathname] || TITLES['/'];

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const displayName = userProfile?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="shell">
      <aside className="shell-sidebar">
        <div className="shell-logo" title="Oklahoma City Thunder">
          <BrandLogo size={60} />
        </div>

        <nav className="shell-nav" aria-label="Primary">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              title={item.label}
              aria-label={item.label}
              className={({ isActive }) => `shell-nav-link${isActive ? ' active' : ''}`}
            >
              <span className="shell-nav-icon" aria-hidden="true">{item.icon}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shell-sidebar-foot">
          <span className="shell-nav-icon" aria-hidden="true">{ICONS.settings}</span>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-topbar-left">
            <span className="shell-topbar-title">{page.title}</span>
          </div>

          <div className="shell-topbar-right">
            <NavLink to="/deployments" className="shell-create-btn">+ Create</NavLink>
            <button type="button" className="shell-icon-btn shell-icon-btn--dot" title="Notifications" aria-label="Notifications">
              {ICONS.bell}
            </button>

            {currentUser && (
              <div className="profile-menu" ref={profileRef}>
                <button
                  type="button"
                  className="profile-trigger"
                  onClick={() => setProfileOpen(o => !o)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <span className="user-avatar" aria-hidden="true">
                    {(currentUser.email?.[0] ?? '?').toUpperCase()}
                  </span>
                  <span className="user-email">{displayName}</span>
                </button>
                {profileOpen && (
                  <div className="profile-dropdown" role="menu">
                    <div className="profile-dropdown-head">
                      <div className="profile-dropdown-name">{displayName}</div>
                      <div className="profile-dropdown-email">{currentUser.email}</div>
                    </div>
                    <button type="button" className="profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="profile-item-icon" aria-hidden="true">👤</span> Profile
                    </button>
                    <button type="button" className="profile-item" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <span className="profile-item-icon" aria-hidden="true">{ICONS.settings}</span> Settings
                    </button>
                    {!isPartner && (
                      <>
                        <div className="profile-sep" />
                        <div className="profile-label">Viewing as</div>
                        {[
                          { id: 'cp', label: 'Corp Partnerships' },
                          { id: 'fan', label: 'Fan Dev' },
                          { id: 'act', label: 'Activations' },
                        ].map(r => (
                          <button
                            key={r.id}
                            type="button"
                            className={`profile-item${curRole === r.id ? ' profile-item--sel' : ''}`}
                            role="menuitemradio"
                            aria-checked={curRole === r.id}
                            onClick={() => setCurRole(r.id)}
                          >
                            <span className="profile-item-icon" aria-hidden="true">{curRole === r.id ? '✓' : ''}</span> {r.label}
                          </button>
                        ))}
                      </>
                    )}
                    <div className="profile-sep" />
                    <button type="button" className="profile-item profile-item--danger" role="menuitem" onClick={handleLogout}>
                      <span className="profile-item-icon" aria-hidden="true">↪</span> Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {location.pathname === '/' && (
          <section className="shell-hero">
            <div>
              <h1 className="shell-hero-title">Welcome back, {displayName}</h1>
              <div className="shell-hero-sub">Here's what's happening across the 2025–26 season at Paycom Center.</div>
            </div>
          </section>
        )}

        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
