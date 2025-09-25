import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  Home, 
  Users, 
  User, 
  MessageCircle, 
  BookOpen, 
  Heart, 
  GraduationCap, 
  Calculator,
  Search,
  Megaphone,
  Building,
  MessageSquare,
  Bot,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Feed', href: '/feed', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Quran', href: '/quran', icon: BookOpen },
    { name: 'Hadith', href: '/hadith', icon: Heart },
    { name: 'Duas', href: '/duas', icon: Heart },
    { name: 'Learning', href: '/learning', icon: GraduationCap },
    { name: 'Tools', href: '/tools', icon: Calculator },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
    { name: 'Directory', href: '/directory', icon: Building },
    { name: 'Forum', href: '/forum', icon: MessageSquare },
    { name: 'Islamic Bot', href: '/bot', icon: Bot },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const NavLink = ({ item, mobile = false }) => {
    const isActive = isActivePath(item.href);
    const Icon = item.icon;
    
    return (
      <Link
        to={item.href}
        className={`
          flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
          ${isActive 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }
          ${mobile ? 'w-full' : ''}
        `}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
      >
        <Icon className="h-4 w-4 mr-3" />
        {item.name}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                Islamic Community
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:ml-8 lg:space-x-1">
              {navigation.slice(0, 6).map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
              
              {/* More Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 py-2 text-sm font-medium">
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {navigation.slice(6).map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="flex items-center w-full">
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2"
              data-testid="dark-mode-toggle"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-emerald-600 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center w-full">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <NavLink key={item.name} item={item} mobile />
                    ))}
                    
                    {user?.role === 'admin' && (
                      <NavLink 
                        item={{ name: 'Admin Panel', href: '/admin', icon: Settings }} 
                        mobile 
                      />
                    )}
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;