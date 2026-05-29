import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

interface SidebarProps {
    pendingEmailCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ pendingEmailCount = 0 }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActiveRoute = (path: string) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        if (path === '/admin') return location.pathname === '/admin' || location.pathname.startsWith('/admin/users');
        return location.pathname.startsWith(path);
    };

    const navSections = [
        {
            label: 'Workspace',
            items: [
                { path: '/manage-cv', label: 'CV Library', icon: 'description' },
                { path: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
                { path: '/email-suggestions', label: 'Inbox', icon: 'inbox', badge: pendingEmailCount > 0 ? pendingEmailCount : undefined },
            ],
        },
        {
            label: 'Interview',
            items: [
                { path: '/interview-materials', label: 'Prep Library', icon: 'menu_book' },
                { path: '/interview-buddy', label: 'Interview Buddy', icon: 'record_voice_over' },
            ],
        },
        {
            label: 'Tools',
            items: [
                { path: '/auto-jobs', label: 'Auto Jobs', icon: 'rocket_launch', disabled: true },
                { path: '/work-tracker', label: 'Time Tracker', icon: 'timer' },
                { path: '/calendar', label: 'Calendar', icon: 'event' },
                { path: '/analytics', label: 'Analytics', icon: 'insights' },
            ],
        },
        {
            label: 'Account',
            items: [
                { path: '/portfolio-setup', label: 'Portfolio', icon: 'badge' },
                { path: '/settings', label: 'Settings', icon: 'tune' },
                { path: '/subscriptions', label: 'Subscription', icon: 'workspace_premium' },
            ],
        },
    ];

    const adminItems = [
        { path: '/admin', label: 'Admin Dashboard', icon: 'admin_panel_settings' },
        { path: '/admin/errors', label: 'Error Logs', icon: 'bug_report' },
    ];

    const userLabel = user?.username || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';

    return (
        <aside
            className={`flex flex-col h-screen flex-shrink-0 transition-all duration-300 relative ${
                isCollapsed ? 'w-[68px]' : 'w-64'
            }`}
            style={{ backgroundColor: '#0F172A' }}
        >
            {/* Collapse toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center z-50 transition-all hover:scale-110"
                style={{ backgroundColor: '#4F46E5', color: '#fff' }}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <Icon
                    name={isCollapsed ? 'chevron_right' : 'chevron_left'}
                    className="text-[14px]"
                />
            </button>

            {/* ── Brand ── */}
            <div
                className={`flex items-center flex-shrink-0 ${isCollapsed ? 'justify-center px-2 py-5' : 'px-5 py-5'}`}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                {!isCollapsed ? (
                    <Link to="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                        >
                            <Icon name="nest_eco_leaf" className="text-[18px] text-white" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span
                                className="text-[17px] font-bold tracking-tight text-white"
                                style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}
                            >
                                Hire<span style={{ color: '#818CF8' }}>Nest</span>
                            </span>
                            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                Job Intelligence
                            </span>
                        </div>
                    </Link>
                ) : (
                    <Link to="/dashboard" className="hover:opacity-90 transition-opacity">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                        >
                            <Icon name="nest_eco_leaf" className="text-[18px] text-white" />
                        </div>
                    </Link>
                )}
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4"
                style={{ scrollbarWidth: 'none' }}>
                {navSections.map((section) => (
                    <div key={section.label} className="mb-1">
                        {!isCollapsed && (
                            <h3
                                className="px-4 text-[10px] font-semibold uppercase tracking-widest mb-1.5 mt-3"
                                style={{ color: 'rgba(255,255,255,0.25)' }}
                            >
                                {section.label}
                            </h3>
                        )}
                        {isCollapsed && <div className="my-2 mx-3 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
                        <ul className="space-y-0.5 px-2">
                            {section.items.map((item) => {
                                const isActive = isActiveRoute(item.path);
                                const isDisabled = !!(item as any).disabled;

                                if (isDisabled) {
                                    return (
                                        <li key={item.path}>
                                            <div
                                                title={isCollapsed ? `${item.label} (coming soon)` : undefined}
                                                className={`flex items-center rounded-lg cursor-not-allowed select-none px-3 py-2 ${
                                                    isCollapsed ? 'justify-center' : 'justify-between'
                                                }`}
                                                style={{ color: 'rgba(255,255,255,0.2)' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon name={item.icon} className="text-[18px]" />
                                                    {!isCollapsed && (
                                                        <span className="text-[13px] font-medium">{item.label}</span>
                                                    )}
                                                </div>
                                                {!isCollapsed && (
                                                    <span
                                                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: 'rgba(255,255,255,0.06)',
                                                            color: 'rgba(255,255,255,0.25)',
                                                        }}
                                                    >
                                                        SOON
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            title={isCollapsed ? item.label : undefined}
                                            className={`flex items-center rounded-lg transition-all group relative ${
                                                isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'
                                            }`}
                                            style={isActive ? {
                                                backgroundColor: 'rgba(79,70,229,0.20)',
                                                color: '#A5B4FC',
                                            } : {
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) (e.currentTarget as HTMLElement).style.cssText += ';background-color:rgba(255,255,255,0.05);color:rgba(255,255,255,0.85)';
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) (e.currentTarget as HTMLElement).style.cssText = `color:rgba(255,255,255,0.5)`;
                                            }}
                                        >
                                            {isActive && (
                                                <span
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                                    style={{ backgroundColor: '#818CF8' }}
                                                />
                                            )}
                                            <Icon
                                                name={item.icon}
                                                className={`text-[18px] flex-shrink-0 ${isActive ? 'text-indigo-400' : ''}`}
                                            />
                                            {!isCollapsed && (
                                                <span className={`text-[13px] font-medium flex-1 ${isActive ? 'text-indigo-300' : ''}`}>
                                                    {item.label}
                                                </span>
                                            )}
                                            {!isCollapsed && (item as any).badge && (
                                                <span
                                                    className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1 rounded-full text-white"
                                                    style={{ backgroundColor: '#4F46E5' }}
                                                >
                                                    {(item as any).badge > 9 ? '9+' : (item as any).badge}
                                                </span>
                                            )}
                                            {isCollapsed && (item as any).badge && (
                                                <span
                                                    className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                                                    style={{ backgroundColor: '#4F46E5' }}
                                                >
                                                    {(item as any).badge > 9 ? '9+' : (item as any).badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}

                {/* Admin Section */}
                {(user?.role === 'admin' || user?.role === 'owner') && (
                    <div className="mb-1">
                        {!isCollapsed && (
                            <h3
                                className="px-4 text-[10px] font-semibold uppercase tracking-widest mb-1.5 mt-3"
                                style={{ color: 'rgba(255,255,255,0.25)' }}
                            >
                                Admin
                            </h3>
                        )}
                        <ul className="space-y-0.5 px-2">
                            {adminItems.map((item) => {
                                const isActive = isActiveRoute(item.path);
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            title={isCollapsed ? item.label : undefined}
                                            className={`flex items-center rounded-lg transition-all group relative ${
                                                isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'
                                            }`}
                                            style={isActive ? {
                                                backgroundColor: 'rgba(79,70,229,0.20)',
                                                color: '#A5B4FC',
                                            } : {
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) (e.currentTarget as HTMLElement).style.cssText += ';background-color:rgba(255,255,255,0.05);color:rgba(255,255,255,0.85)';
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) (e.currentTarget as HTMLElement).style.cssText = `color:rgba(255,255,255,0.5)`;
                                            }}
                                        >
                                            {isActive && (
                                                <span
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                                    style={{ backgroundColor: '#818CF8' }}
                                                />
                                            )}
                                            <Icon name={item.icon} className="text-[18px] flex-shrink-0" />
                                            {!isCollapsed && (
                                                <span className="text-[13px] font-medium">{item.label}</span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </nav>

            {/* ── User Profile ── */}
            <div
                className="flex-shrink-0 p-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                {!isCollapsed ? (
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                        >
                            {userLabel.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">{userLabel}</p>
                            <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{userEmail}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-white/10"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                            <Icon name="logout" className="text-[16px]" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="w-full flex items-center justify-center p-2 rounded-lg transition-all hover:bg-white/10"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                        <Icon name="logout" className="text-[18px]" />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
