import React, { useState } from 'react';
import { Scissors, User, History, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRateLimit } from '../hooks/useRateLimit';
import AuthModal from './AuthModal';
import HistoryModal from './HistoryModal';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { remainingRequests } = useRateLimit();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      setShowUserMenu(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                BackSnap
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-4 text-sm text-gray-400">
                    <span>{remainingRequests} requests remaining today</span>
                  </div>
                  
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden md:inline">History</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden md:inline text-sm">{user.email}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 glass-card p-2 z-10">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2 p-2 text-left hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <HistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => setShowHistoryModal(false)} 
      />
    </>
  );
};

export default Header;