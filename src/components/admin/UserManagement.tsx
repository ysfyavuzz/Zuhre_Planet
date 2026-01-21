/**
 * UserManagement Component
 * 
 * User CRUD interface for managing customers and escorts.
 * Allows viewing, editing, suspending, and deleting users.
 * 
 * @component
 * @category Admin
 */

import * as React from 'react';
import { Search, Filter, MoreVertical, Ban, CheckCircle, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockCustomers, type Customer } from '@/data/mockData/customers';
import { mockEscorts, type EscortProfile } from '@/data/mockData/escorts';

type UserType = 'all' | 'customers' | 'escorts';
type UserStatus = 'all' | 'active' | 'suspended' | 'pending';

export function UserManagement() {
  const [userType, setUserType] = React.useState<UserType>('all');
  const [status, setStatus] = React.useState<UserStatus>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Combine customers and escorts for display
  const allUsers = React.useMemo(() => {
    const users: Array<{ type: 'customer' | 'escort'; data: any }> = [];
    
    if (userType === 'all' || userType === 'customers') {
      mockCustomers.forEach(customer => {
        users.push({ type: 'customer', data: customer });
      });
    }
    
    if (userType === 'all' || userType === 'escorts') {
      mockEscorts.forEach(escort => {
        users.push({ type: 'escort', data: escort });
      });
    }
    
    return users;
  }, [userType]);

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return allUsers.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      
      if (user.type === 'customer') {
        const customer = user.data as Customer;
        return (
          customer.username.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.fullName?.toLowerCase().includes(searchLower)
        );
      } else {
        const escort = user.data as EscortProfile;
        return (
          escort.displayName.toLowerCase().includes(searchLower) ||
          escort.city.toLowerCase().includes(searchLower)
        );
      }
    });
  }, [allUsers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-500 mt-1">Tüm kullanıcıları yönetin</p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700">
          Yeni Kullanıcı Ekle
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* User Type Filter */}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Tüm Kullanıcılar</option>
            <option value="customers">Müşteriler</option>
            <option value="escorts">Eskortlar</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="suspended">Askıya Alınmış</option>
            <option value="pending">Beklemede</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allUsers.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Müşteriler</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockCustomers.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Eskortlar</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockEscorts.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Bekleyen Onaylar</p>
          <p className="text-2xl font-bold text-pink-600 mt-1">
            {mockEscorts.filter(e => e.verificationStatus === 'pending').length}
          </p>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tip
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => {
                const isCustomer = user.type === 'customer';
                const userData = user.data;
                
                return (
                  <tr key={`${user.type}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {isCustomer 
                            ? (userData as Customer).username.charAt(0).toUpperCase()
                            : (userData as EscortProfile).displayName.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {isCustomer 
                              ? (userData as Customer).username 
                              : (userData as EscortProfile).displayName
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {isCustomer 
                              ? (userData as Customer).fullName 
                              : `${(userData as EscortProfile).city}, ${(userData as EscortProfile).district}`
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={isCustomer ? 'secondary' : 'default'}>
                        {isCustomer ? 'Müşteri' : 'Eskort'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {isCustomer && (
                          <>
                            <div className="flex items-center gap-1 mb-1">
                              <Mail className="w-3 h-3" />
                              <span>{(userData as Customer).email}</span>
                            </div>
                            {(userData as Customer).phoneNumber && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{(userData as Customer).phoneNumber}</span>
                              </div>
                            )}
                          </>
                        )}
                        {!isCustomer && (
                          <span>{(userData as EscortProfile).hourlyRate} ₺/saat</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isCustomer ? (
                        <Badge variant={(userData as Customer).isVerified ? 'default' : 'secondary'}>
                          {(userData as Customer).isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                        </Badge>
                      ) : (
                        <Badge 
                          variant={
                            (userData as EscortProfile).verificationStatus === 'verified' 
                              ? 'default' 
                              : (userData as EscortProfile).verificationStatus === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {(userData as EscortProfile).verificationStatus === 'verified' 
                            ? 'Onaylandı' 
                            : (userData as EscortProfile).verificationStatus === 'pending'
                            ? 'Beklemede'
                            : 'Reddedildi'
                          }
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isCustomer 
                        ? new Date((userData as Customer).createdAt).toLocaleDateString('tr-TR')
                        : new Date((userData as EscortProfile).joinDate).toLocaleDateString('tr-TR')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Ban className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Kullanıcı bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
