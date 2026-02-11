/**
 * Login Page (Galaxy Unified)
 * 
 * Kozmik tema ile uyumlu, rol tabanlı giriş seçici.
 * 
 * @page
 * @category Auth
 */

import { useLocation } from 'wouter';
import { User, Sparkles, Shield, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [, setLocation] = useLocation();

  const roles = [
    {
      id: 'customer',
      title: 'Gezgin Girişi',
      description: 'Galaksiyi keşfedin, favorilerinizi yönetin ve iletişime geçin.',
      icon: Rocket,
      href: '/login-customer',
      color: 'from-blue-500 to-purple-600',
      badge: 'Müşteri'
    },
    {
      id: 'escort',
      title: 'Yıldız Girişi',
      description: 'Kendi gezegeninizi yönetin, parlayın ve kazanç elde edin.',
      icon: Sparkles,
      href: '/login-escort',
      color: 'from-amber-400 to-amber-600',
      badge: 'Escort & Model'
    }
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-black">
      {/* Arka Plan Dekorasyonu */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            ZUHRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-500">PLANET</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-medium"
          >
            Devam etmek için giriş tipinizi seçin
          </motion.p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              onClick={() => setLocation(role.href)}
              className="group cursor-pointer relative"
            >
              {/* Card Glass Effect */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 group-hover:border-white/20 transition-all duration-500" />
              
              <div className="relative p-10 flex flex-col items-center text-center">
                {/* Badge */}
                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 bg-gradient-to-r ${role.color} text-white shadow-lg`}>
                  {role.badge}
                </span>

                <div className={`w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <role.icon className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {role.title}
                </h2>
                
                <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                  {role.description}
                </p>
                
                <div className={`w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold group-hover:bg-gradient-to-r ${role.color} group-hover:border-transparent transition-all duration-300`}>
                  Giriş Yap
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Link & Help */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 flex flex-col gap-4"
        >
          <p className="text-gray-500">
            Hesabınız yok mu?{' '}
            <a href="/register" className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
              Hemen Katılın
            </a>
          </p>
          <a href="/admin/login" className="text-gray-700 hover:text-gray-500 text-sm flex items-center justify-center gap-2 transition-colors">
            <Shield className="w-4 h-4" /> Admin Paneli
          </a>
        </motion.div>
      </div>
    </div>
  );
}