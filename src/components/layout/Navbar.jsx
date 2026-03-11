import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Search, ChevronDown, User, Menu, X,
  Sparkles, LogOut, Layout, Zap, BookOpen, BarChart2,
  ArrowRight, Star
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CommandPalette from '../ui/CommandPalette';
import { useCourse } from '../../lib/CourseContext';

// ─── Nav Link ────────────────────────────────────────────────────────────────
const NavLink = ({ to, children, mobile = false, onClick, active }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
        mobile
          ? "w-full text-center text-lg py-4 font-bold"
          : active
            ? "text-white bg-white/10"
            : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
      {active && !mobile && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 rounded-full bg-white/10 -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
    </Link>
  );
};

// ─── Product Dropdown Item ─────────────────────────────────────────────────
const DropdownItem = ({ icon: Icon, title, sub, gradient, to }) => (
  <Link to={to || '#'} className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/5 transition-all group">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{title}</p>
      <p className="text-[10px] text-white/35 uppercase tracking-wider font-semibold mt-0.5">{sub}</p>
    </div>
  </Link>
);

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const { globalMemory, logout } = useCourse();
  const isAuthenticated = globalMemory && globalMemory.userName;
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        scrolled
          ? "py-0"
          : "py-2"
      )}>
        {/* Background */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          scrolled
            ? "bg-[#030309]/85 backdrop-blur-2xl border-b border-white/[0.05]"
            : "bg-transparent"
        )} />

        <div className="container mx-auto px-6 h-[72px] flex justify-between items-center relative">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white leading-none">
                CourseForge
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 leading-none mt-0.5">
                AI Learning
              </span>
            </div>
          </Link>

          {/* ── Center Nav Pills ── */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] p-1.5 rounded-2xl backdrop-blur-xl shadow-xl">
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/#features" active={false}>Features</NavLink>
              <NavLink to="/#pricing" active={false}>Pricing</NavLink>

              <div className="w-px h-4 bg-white/10 mx-1" />

              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all">
                  Products
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", dropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72"
                    >
                      <div className="bg-[#0d0d22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 relative">
                        {/* Shimmer top bar */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                        <DropdownItem
                          icon={BrainCircuit}
                          title="Course Generator"
                          sub="Flagship · Free to use"
                          gradient="from-violet-600 to-indigo-600"
                          to="/analyzer"
                        />
                        <DropdownItem
                          icon={BookOpen}
                          title="Course Player"
                          sub="Full learning experience"
                          gradient="from-blue-600 to-cyan-600"
                          to="/analyzer"
                        />
                        <DropdownItem
                          icon={BarChart2}
                          title="Progress Dashboard"
                          sub="Track & analyze"
                          gradient="from-emerald-600 to-teal-600"
                          to="/dashboard"
                        />

                        <div className="mt-2 pt-2 border-t border-white/5">
                          <Link to="/demo" className="flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors group">
                            <span>See Live Demo</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Right Actions ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <div className="h-5 w-px bg-white/10" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/30 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-all">
                    <Layout className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <button
                  onClick={() => { logout(); window.location.href = '/'; }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-all group px-3 py-2 rounded-xl hover:bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
                    <User className="w-3.5 h-3.5 text-white/60" />
                  </div>
                  <span className="hidden lg:inline">Sign In</span>
                </Link>

                <Link to="/analyzer">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden font-bold text-sm text-white"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                    <Zap className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Get Started</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden relative z-50 p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-24 z-50 bg-[#0d0d22]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col gap-6"
            >
              {/* Shimmer top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent rounded-t-3xl" />

              <div className="flex flex-col gap-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/demo', label: 'Try Demo' },
                  { to: '/#features', label: 'Features' },
                  { to: '/#pricing', label: 'Pricing' },
                  { to: '/analyzer', label: 'Course Generator' },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-semibold text-base transition-all border border-transparent hover:border-white/8"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/5" />

              <div className="grid grid-cols-2 gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-sm text-center">
                      Dashboard
                    </Link>
                    <button onClick={() => { logout(); window.location.href = '/'; }}
                      className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-bold text-sm">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm text-center">
                      Sign In
                    </Link>
                    <Link to="/analyzer" onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm text-center border border-violet-500/30">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
