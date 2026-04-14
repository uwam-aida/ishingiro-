import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white selection:bg-[#F57C00]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tighter">
          ISHINGIRO<span className="text-[#F57C00]">SHOP</span>
        </div>
        <div>
          <Link 
            href="/login" 
            className="px-6 py-2 rounded-full border border-white/20 hover:border-[#F57C00] transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wide uppercase bg-[#F57C00]/10 text-[#F57C00] rounded-full border border-[#F57C00]/20">
          Professional Retail Management
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight">
          Manage your shop <br />
          <span className="text-[#F57C00]">with confidence.</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-gray-400 mb-12">
          The all-in-one system for Ishingiro Shop. Track inventory, manage sales, 
          and generate real-time reports with our modern, secure dashboard.
        </p>

        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="bg-[#F57C00] hover:bg-[#e67500] text-white px-10 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            Enter Dashboard
          </Link>
          <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-xl font-bold text-lg border border-white/10 transition-colors">
            View Features
          </button>
        </div>

        {/* Feature Grid Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-[#F57C00] rounded-lg mb-6 flex items-center justify-center font-bold">01</div>
            <h3 className="text-xl font-bold mb-3">Live Inventory</h3>
            <p className="text-gray-400">Track every item in your store in real-time. Never run out of stock again.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-[#F57C00] rounded-lg mb-6 flex items-center justify-center font-bold">02</div>
            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
            <p className="text-gray-400">Integrated MoMo and POS tracking to keep your finances secure and transparent.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-12 h-12 bg-[#F57C00] rounded-lg mb-6 flex items-center justify-center font-bold">03</div>
            <h3 className="text-xl font-bold mb-3">Expert Analytics</h3>
            <p className="text-gray-400">Generate daily, weekly, and monthly reports with a single click.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Ishingiro Shop Management System. All rights reserved.
      </footer>
    </div>
  );
}