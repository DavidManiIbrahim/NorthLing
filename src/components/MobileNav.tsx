import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const MobileNav = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // Profile modal will be handled by parent component
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between py-4">
              <h2 className="text-lg font-semibold">Menu</h2>
            </div>

            <div className="flex-1 space-y-4">
              {isAuthenticated && user ? (
                <>
                  <div className="py-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.username || user.email.split('@')[0] || 'User'}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleProfileClick}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>

                    {user.role === 'admin' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate('/admin');
                          setIsOpen(false);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/auth?mode=login');
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate('/auth?mode=signup');
                      setIsOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;