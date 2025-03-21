
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", path: "/features" },
        { name: "Pricing", path: "/pricing" },
        { name: "Security", path: "/security" },
        { name: "Enterprise", path: "/enterprise" },
        { name: "Updates", path: "/updates" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Partners", path: "/partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "/docs" },
        { name: "Help Center", path: "/help" },
        { name: "Community", path: "/community" },
        { name: "Contact", path: "/contact" },
        { name: "Status", path: "/status" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", path: "/privacy" },
        { name: "Terms", path: "/terms" },
        { name: "Security", path: "/security" },
        { name: "Cookies", path: "/cookies" },
        { name: "GDPR", path: "/gdpr" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
    { name: "GitHub", icon: Github, url: "https://github.com" },
  ];

  const contactInfo = [
    { icon: Mail, text: "contact@agentverse.com" },
    { icon: MapPin, text: "123 AI Street, San Francisco, CA" },
    { icon: Phone, text: "+1 (555) 123-4567" },
  ];

  return (
    <footer className="bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" />
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo and company info */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <Logo />
            </Link>
            <p className="text-white/70 mb-6 max-w-xs">
              Empowering businesses with intelligent AI solutions that transform workflows and drive growth.
            </p>
            <div className="space-y-3">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Links sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="font-semibold mb-4 text-white text-base">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                  >
                    <Link
                      to={link.path}
                      className="text-white/70 hover:text-blue-300 transition-colors text-sm inline-block py-1"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom bar with social and copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/70 text-sm order-2 md:order-1">
              © 2024 AgentVerse. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 order-1 md:order-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-white/70 hover:text-blue-300 transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
