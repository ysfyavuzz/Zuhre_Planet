/**
 * Şikayet Sayfası
 * 
 * Kullanıcıların şikayet oluşturmasını sağlayan sayfa.
 * Şikayet türü, kullanıcı seçimi, detaylı açıklama, kanıt yükleme gibi özellikler içerir.
 * 
 * @module pages/Report
 * @category Pages
 * 
 * Özellikler:
 * - Şikayet türü seçimi
 * - Şikayet edilen kullanıcı seçimi (autocomplete)
 * - Detaylı açıklama alanı (min 50 karakter)
 * - Kanıt yükleme (max 3 dosya, drag & drop)
 * - Anonim şikayet seçeneği
 * - Öncelik seçimi
 * - Form validation
 * - Başarı mesajı ve takip numarası
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card3D } from '@/components/3d/Card3D';
import { Button3D } from '@/components/3d/Button3D';
import { Input3D } from '@/components/3d/Input3D';
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  FileText,
  User,
  AlertTriangle,
  Shield,
  FileWarning,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockEscorts, mockCustomers } from '@/data/mockData';

/**
 * Şikayet türleri
 */
type ComplaintType = 'escort_behavior' | 'payment_issue' | 'technical' | 'security' | 'other';

/**
 * Şikayet öncelik seviyeleri
 */
type Priority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Şikayet formu verileri interface
 */
interface ComplaintFormData {
  type: ComplaintType;
  reportedUserId: string;
  description: string;
  files: File[];
  isAnonymous: boolean;
  priority: Priority;
}

/**
 * Yüklenen dosya interface
 */
interface UploadedFile {
  file: File;
  preview: string;
}

export default function Report() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ComplaintFormData>({
    type: 'escort_behavior',
    reportedUserId: '',
    description: '',
    files: [],
    isAnonymous: false,
    priority: 'medium',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  // Kullanıcı listesi (escort ve customer birleşik)
  const allUsers = [
    ...mockEscorts.map(e => ({ id: e.id, name: e.displayName, type: 'Escort' })),
    ...mockCustomers.map(c => ({ id: c.id, name: c.username, type: 'Müşteri' })),
  ];

  // Kullanıcı arama filtresi
  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  /**
   * Form alanı değişikliği handler
   */
  const handleChange = (field: keyof ComplaintFormData, value: ComplaintFormData[typeof field]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Dosya yükleme handler
   */
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 3 - uploadedFiles.length);
    const newUploadedFiles: UploadedFile[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles].slice(0, 3));
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles].slice(0, 3),
    }));
  }, [uploadedFiles.length]);

  /**
   * Dosya silme handler
   */
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  /**
   * Drag & Drop handlers
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  /**
   * Form validasyonu
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Şikayet türü seçmelisiniz';
    }

    if (formData.description.trim().length < 50) {
      newErrors.description = 'Açıklama en az 50 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Form gönderme handler
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Takip numarası oluştur
    const tracking = `SK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTrackingNumber(tracking);
    setIsSuccess(true);
    setIsSubmitting(false);

    // Form sıfırla
    setTimeout(() => {
      setFormData({
        type: 'escort_behavior',
        reportedUserId: '',
        description: '',
        files: [],
        isAnonymous: false,
        priority: 'medium',
      });
      setUploadedFiles([]);
      setUserSearch('');
      setIsSuccess(false);
      setTrackingNumber('');
    }, 5000);
  };

  // Şikayet türleri
  const complaintTypes = [
    { value: 'escort_behavior', label: 'Escort Davranışı', icon: User },
    { value: 'payment_issue', label: 'Ödeme Sorunu', icon: FileWarning },
    { value: 'technical', label: 'Teknik Sorun', icon: AlertCircle },
    { value: 'security', label: 'Güvenlik', icon: Shield },
    { value: 'other', label: 'Diğer', icon: FileText },
  ];

  // Öncelik seviyeleri
  const priorities = [
    { value: 'low', label: 'Düşük', color: 'text-blue-600' },
    { value: 'medium', label: 'Orta', color: 'text-yellow-600' },
    { value: 'high', label: 'Yüksek', color: 'text-orange-600' },
    { value: 'urgent', label: 'Acil', color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full mb-4 shadow-lg">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Şikayet Oluştur
          </h1>
          <p className="text-gray-600">
            Yaşadığınız sorunları bildirerek platformumuzun daha güvenli olmasına katkıda bulunun
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            // Başarı Mesajı
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card3D elevation="high" className="bg-white">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Şikayetiniz Alındı
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Şikayetiniz başarıyla kaydedildi. En kısa sürede incelenecektir.
                  </p>
                  <div className="inline-block bg-gradient-to-r from-rose-100 to-pink-100 px-6 py-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-1">Takip Numaranız</p>
                    <p className="text-2xl font-mono font-bold text-rose-600">
                      {trackingNumber}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Bu numarayı kullanarak şikayetinizin durumunu takip edebilirsiniz
                  </p>
                </div>
              </Card3D>
            </motion.div>
          ) : (
            // Şikayet Formu
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card3D elevation="high" className="bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Şikayet Türü */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Şikayet Türü <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {complaintTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <motion.button
                            key={type.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleChange('type', type.value as ComplaintType)}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                              formData.type === type.value
                                ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-md'
                                : 'border-gray-200 hover:border-rose-300 bg-white'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${formData.type === type.value ? 'text-rose-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${formData.type === type.value ? 'text-rose-700' : 'text-gray-700'}`}>
                              {type.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.type && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Şikayet Edilen Kullanıcı */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şikayet Edilen Kullanıcı (Opsiyonel)
                    </label>
                    <Input3D
                      placeholder="Kullanıcı ara..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      icon={<User className="w-5 h-5" />}
                    />
                    {showUserDropdown && userSearch && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, reportedUserId: user.id }));
                                setUserSearch(`${user.name} (${user.type})`);
                                setShowUserDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-rose-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{user.name}</span>
                                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                                  {user.type}
                                </span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-center">
                            Kullanıcı bulunamadı
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Detaylı Açıklama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detaylı Açıklama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Şikayetinizi detaylı bir şekilde açıklayın (en az 50 karakter)..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        errors.description
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 bg-white shadow-inner'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-sm ${formData.description.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                        {formData.description.length} / 50 karakter minimum
                      </span>
                      {errors.description && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Kanıt Yükleme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kanıt Yükleme (Opsiyonel, Maksimum 3 Dosya)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-white"
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                        disabled={uploadedFiles.length >= 3}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium mb-1">
                          Dosyaları sürükleyip bırakın veya tıklayın
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, PDF (Maksimum 3 dosya)
                        </p>
                      </label>
                    </div>

                    {/* Yüklenen Dosyalar */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((uploaded, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-rose-600" />
                              <span className="text-sm font-medium text-gray-700">
                                {uploaded.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(uploaded.file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Öncelik Seçimi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Öncelik Seviyesi
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {priorities.map(priority => (
                        <motion.button
                          key={priority.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChange('priority', priority.value as Priority)}
                          className={`p-3 rounded-lg border-2 font-medium transition-all ${
                            formData.priority === priority.value
                              ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-md'
                              : 'border-gray-200 hover:border-rose-300 bg-white'
                          }`}
                        >
                          <span className={formData.priority === priority.value ? 'text-rose-700' : priority.color}>
                            {priority.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Anonim Şikayet */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleChange('isAnonymous', e.target.checked)}
                      className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <label htmlFor="anonymous" className="flex-1 cursor-pointer">
                      <span className="font-medium text-gray-900">Anonim Şikayet</span>
                      <p className="text-sm text-gray-600">
                        Kimliğiniz gizli tutulacaktır
                      </p>
                    </label>
                  </div>

                  {/* Gönder Butonu */}
                  <div className="pt-4">
                    <Button3D
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Gönderiliyor...' : 'Şikayeti Gönder'}
                    </Button3D>
                  </div>

                  {/* Bilgilendirme */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Şikayetiniz Güvendedir</p>
                      <p className="text-blue-700">
                        Tüm şikayetler 24 saat içinde incelenir ve gerekli aksiyonlar alınır.
                        Şikayetinizin durumunu takip numaranız ile kontrol edebilirsiniz.
                      </p>
                    </div>
                  </div>
                </form>
              </Card3D>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
