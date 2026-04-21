import { useState } from 'react';
import { Link } from 'react-router';
import { 
  Users, 
  ShieldCheck, 
  Lock, 
  Menu, 
  X 
} from 'lucide-react';
import GovEmblem from '../../../assets/gov_emblem_pds.png';

function LoginDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const roles = [
        { name: "Beneficiary", path: "/login/user", icon: Users },
        { name: "Retail Dealer", path: "/login/dealer", icon: ShieldCheck },
        { name: "Administrator", path: "/login/admin", icon: Lock },
    ];

    return (
        <div className="relative">
            <button 
                onMouseEnter={() => setIsOpen(true)}
                className="h-12 px-6 bg-blue-900 text-white rounded-xl flex items-center gap-3 font-black text-[12px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg"
            >
                Portal Login
            </button>
            
            {isOpen && (
                <div 
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3"
                >
                    <div className="p-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Select Access Level</p>
                        <div className="flex flex-col gap-1">
                            {roles.map((r, i) => (
                                <Link 
                                    key={i}
                                    to={r.path}
                                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <r.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-gray-900 tracking-tight">{r.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems = [
        { name: 'Features', path: '/features' },
        { name: 'Impact', path: '/impact' },
        { name: 'About', path: '/about' }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 overflow-x-hidden">
            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={GovEmblem} alt="Gov Logo" className="h-10 w-auto" />
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-blue-900 leading-none tracking-tighter">Mukh Swasthya</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Government of India</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                to={item.path}
                                className="text-[13px] font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="h-6 w-px bg-gray-200" />
                        <LoginDropdown />
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
                         {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-left text-sm font-bold text-gray-700 uppercase tracking-widest"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link to="/role-selection" className="h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase tracking-widest">
                            Portal Login
                        </Link>
                    </div>
                )}
            </nav>

            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2">
                         <div className="flex items-center gap-3 mb-8">
                            <img src={GovEmblem} alt="Gov Logo" className="h-12 w-auto" />
                            <div className="flex flex-col">
                                <span className="text-lg font-black text-blue-900 uppercase">Mukh Swasthya HUB</span>
                                <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Official National Portal</span>
                            </div>
                        </div>
                        <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
                            Ensuring food security and basic necessities through advanced technological integration.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Quick Links</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                             <li className="hover:text-blue-600 transition-colors cursor-pointer uppercase">Terms of Utility</li>
                             <li className="hover:text-blue-600 transition-colors cursor-pointer uppercase">Privacy Policy</li>
                             <li className="hover:text-blue-600 transition-colors cursor-pointer uppercase">Reports</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">© 2024 Mukh Swasthya. National Health Distribution System.</p>
                    <div className="flex gap-6">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter cursor-pointer">English</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter cursor-pointer">Hindi</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter cursor-pointer">Tamil</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
