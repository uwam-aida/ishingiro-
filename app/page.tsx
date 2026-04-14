import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1C1C1C] selection:bg-[#F57C00] selection:text-white">
      {/* Navigation - Exact match for the logo background color */}
      <nav className="flex items-center justify-between px-8 py-2 border-b border-gray-200 bg-[#F6F6F6] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo Container - Sized to let the tagline be visible */}
          <div className="relative w-32 h-24 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Ishingiro Shop Logo" 
              fill
              className="object-contain" 
              priority
            />
          </div>
          
          {/* Vertical Divider */}
          <div className="hidden md:block h-12 border-l border-gray-300 ml-2"></div>
          
          <div className="text-3xl font-black tracking-tighter uppercase text-[#1C1C1C]">
            ISHINGIRO<span className="text-[#F57C00]">SHOP</span>
          </div>
        </div>
        
        <div>
          <Link 
            href="/login" 
            className="px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white font-bold text-sm hover:bg-[#F57C00] transition-all shadow-md"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">
        
        
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-[#1C1C1C]">
          Manage your shop <br />
          <span className="text-[#F57C00]">with confidence.</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-gray-500 mb-12 leading-relaxed italic">
          "Gutekereza neza no gukora neza nibwo butwari."
        </p>

        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="bg-[#F57C00] hover:bg-[#1C1C1C] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-[#F57C00]/20 hover:-translate-y-1 active:scale-95"
          >
            Enter Dashboard
          </Link>
        </div>

        {/* Feature Grid Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full text-left">
          {[
            { 
              num: "01", 
              title: "Live Inventory", 
              desc: "Track every item in your store in real-time. Never run out of stock again." 
            },
            { 
              num: "02", 
              title: "Secure Payments", 
              desc: "Integrated MoMo and POS tracking to keep your finances secure and transparent." 
            },
            { 
              num: "03", 
              title: "Expert Analytics", 
              desc: "Generate daily, weekly, and monthly reports with a single click." 
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 bg-[#F4F4F4] rounded-3xl border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-[#F57C00] text-white rounded-xl mb-6 flex items-center justify-center font-black text-xl shadow-lg shadow-[#F57C00]/30 transition-transform group-hover:scale-110">
                  {feature.num}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#F57C00] transition-colors text-[#1C1C1C]">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-[#F4F4F4] border-t border-gray-200 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Ishingiro Shop Management System. All rights reserved.
      </footer>
    </div>
  );
}