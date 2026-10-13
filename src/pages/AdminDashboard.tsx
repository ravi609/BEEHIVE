import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Briefcase, 
  Film, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import BlogManager from '@/components/admin/BlogManager';
import TeamManager from '@/components/admin/TeamManager';
import JobManager from '@/components/admin/JobManager';
import ShowreelManager from '@/components/admin/ShowreelManager';

type TabType = 'dashboard' | 'blogs' | 'team' | 'jobs' | 'showreels';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs' as TabType, label: 'Blog Posts', icon: FileText },
    { id: 'team' as TabType, label: 'Team Members', icon: Users },
    { id: 'jobs' as TabType, label: 'Job Openings', icon: Briefcase },
    { id: 'showreels' as TabType, label: 'Showreels', icon: Film },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'blogs':
        return <BlogManager />;
      case 'team':
        return <TeamManager />;
      case 'jobs':
        return <JobManager />;
      case 'showreels':
        return <ShowreelManager />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navItems.slice(1).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className="p-6 bg-card border border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage {item.label.toLowerCase()}</p>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex"
    >
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>
          {renderContent()}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default AdminDashboard;
