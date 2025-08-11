import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

export default function Footer() {
  const { currentTheme } = useTheme();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" }
    ],
    services: [
      { name: "Find Specialists", href: "/agents" },
      { name: "Register as Agent", href: "/agent-register" },
      { name: "Job Board", href: "/jobs" },
      { name: "Resources", href: "/resources" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "FAQs", href: "/faqs" },
      { name: "Contact Support", href: "/support" },
      { name: "Community", href: "/community" }
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  };

  return (
    <footer 
      style={{ 
        backgroundColor: currentTheme.colors.primary[900],
        color: currentTheme.colors.neutral[300]
      }}
      className="border-t border-gray-800"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div 
                style={{ 
                  backgroundColor: currentTheme.colors.secondary[500],
                  boxShadow: `0 0 20px ${currentTheme.colors.secondary[500]}40`
                }} 
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              >
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">Migration</span>
                <span 
                  style={{ color: currentTheme.colors.secondary[400] }} 
                  className="text-sm font-medium -mt-1"
                >
                  Marketplace
                </span>
              </div>
            </Link>
            
            <p className="text-sm mb-6 max-w-md">
              Connecting you with Australia's most trusted migration specialists. 
              Expert immigration advice when you need it most.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { name: "Twitter", icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                { name: "LinkedIn", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" },
                { name: "Facebook", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary[800],
                    borderColor: currentTheme.colors.primary[700]
                  }}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center hover:opacity-80 transition-all duration-200 group"
                >
                  <svg 
                    className="w-5 h-5 group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div 
        style={{ 
          backgroundColor: currentTheme.colors.primary[950],
          borderTopColor: currentTheme.colors.primary[800]
        }}
        className="border-t py-6"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <span>&copy; {new Date().getFullYear()} Migration Marketplace. All rights reserved.</span>
              <div className="hidden md:flex gap-4">
                {footerLinks.legal.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span>Made with ❤️ in Australia</span>
              <div 
                style={{ 
                  backgroundColor: currentTheme.colors.accent[600],
                  boxShadow: `0 0 10px ${currentTheme.colors.accent[600]}40`
                }}
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
              >
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 