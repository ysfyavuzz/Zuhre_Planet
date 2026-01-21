/**
 * Login Page (Unified)
 * 
 * Unified login page with role selector.
 * Redirects to appropriate login page based on user selection.
 * 
 * @page
 * @category Auth
 */

import { useLocation } from 'wouter';
import { User, Briefcase, Shield } from 'lucide-react';
import { Card3D } from '@/components/3d';

export default function Login() {
  const [, setLocation] = useLocation();

  const roles = [
    {
      id: 'customer',
      title: 'Müşteri Girişi',
      description: 'Randevu al ve favorilerini yönet',
      icon: User,
      href: '/login-customer',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'escort',
      title: 'Eskort Girişi',
      description: 'Profilini yönet ve kazanç elde et',
      icon: Briefcase,
      href: '/login-escort',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'admin',
      title: 'Admin Girişi',
      description: 'Platform yönetimi ve denetim',
      icon: Shield,
      href: '/admin/login',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hoş Geldiniz
          </h1>
          <p className="text-xl text-gray-600">
            Devam etmek için giriş tipinizi seçin
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card3D
              key={role.id}
              elevation="medium"
              hover
              className="cursor-pointer group"
              onClick={() => setLocation(role.href)}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>
                
                <div className={`inline-block px-6 py-2 bg-gradient-to-r ${role.color} text-white font-semibold rounded-lg shadow-md group-hover:shadow-lg transition-all`}>
                  Giriş Yap
                </div>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Help Text */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Hesabınız yok mu?{' '}
            <a href="/register" className="text-pink-600 font-semibold hover:underline">
              Kayıt Olun
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
