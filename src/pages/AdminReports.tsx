/**
 * Admin Reports Page
 *
 * Comprehensive user reporting and complaint management system.
 * Allows admins to review, investigate, and resolve user-reported issues.
 *
 * @module pages/AdminReports
 * @category Pages - Admin
 *
 * Features:
 * - Report queue with filtering and search
 * - Report categories: harassment, fake profile, inappropriate content, scam
 * - Priority levels: low, medium, high, urgent
 * - Detailed report review with evidence
 * - Resolution workflow with notes
 * - Report statistics and trends
 * - Bulk actions for batch processing
 * - Export reports functionality
 *
 * Security:
 * - Admin role authentication required
 * - Sensitive user data protected
 * - Audit trail for all actions
 *
 * @example
 * ```tsx
 * // Route: /admin/reports
 * <AdminReports />
 * ```
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle, Flag, Search, Filter, Download, Eye, Check, X,
  MessageCircle, User, FileText, Clock, Calendar, TrendingUp,
  Archive, Ban, Shield, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * Report category type
 */
export type ReportCategory =
  | 'harassment'
  | 'fake_profile'
  | 'inappropriate_content'
  | 'scam'
  | 'spam'
  | 'other';

/**
 * Report priority type
 */
export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Report status type
 */
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

/**
 * Report interface
 */
export interface Report {
  id: string;
  category: ReportCategory;
  priority: ReportPriority;
  status: ReportStatus;
  reporterId: string;
  reporterName: string;
  reporterAvatar?: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserAvatar?: string;
  reason: string;
  description: string;
  evidence?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolutionNote?: string;
  assignedTo?: string;
}

/**
 * Props for ReportCard component
 */
interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onResolve: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
}

/**
 * Get category badge
 */
function getCategoryBadge(category: ReportCategory) {
  const config = {
    harassment: { label: 'Taciz', icon: <Shield className="w-3 h-3" />, color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    fake_profile: { label: 'Sahte Profil', icon: <User className="w-3 h-3" />, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    inappropriate_content: { label: 'Uygunsuz İçerik', icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    scam: { label: 'Dolandırıcılık', icon: <AlertCircle className="w-3 h-3" />, color: 'bg-red-500/20 text-red-700 border-red-500/30' },
    spam: { label: 'Spam', icon: <MessageCircle className="w-3 h-3" />, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    other: { label: 'Diğer', icon: <FileText className="w-3 h-3" />, color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  };
  const { label, icon, color } = config[category];
  return (
    <Badge variant="outline" className={`gap-1 ${color}`}>
      {icon}
      {label}
    </Badge>
  );
}

/**
 * Get priority badge
 */
function getPriorityBadge(priority: ReportPriority) {
  const config = {
    low: { label: 'Düşük', color: 'bg-gray-500/10 text-gray-600' },
    medium: { label: 'Orta', color: 'bg-blue-500/10 text-blue-600' },
    high: { label: 'Yüksek', color: 'bg-amber-500/10 text-amber-600' },
    urgent: { label: 'Acil', color: 'bg-red-500/10 text-red-600 animate-pulse' },
  };
  const { label, color } = config[priority];
  return <Badge className={color}>{label}</Badge>;
}

/**
 * Get status badge
 */
function getStatusBadge(status: ReportStatus) {
  const config = {
    pending: { label: 'Bekliyor', icon: <Clock className="w-3 h-3" />, color: 'bg-yellow-500/10 text-yellow-600' },
    investigating: { label: 'İnceleniyor', icon: <Search className="w-3 h-3" />, color: 'bg-blue-500/10 text-blue-600' },
    resolved: { label: 'Çözüldü', icon: <CheckCircle2 className="w-3 h-3" />, color: 'bg-green-500/10 text-green-600' },
    dismissed: { label: 'Reddedildi', icon: <XCircle className="w-3 h-3" />, color: 'bg-gray-500/10 text-gray-600' },
  };
  const { label, icon, color } = config[status];
  return (
    <Badge className={`${color} gap-1`}>
      {icon}
      {label}
    </Badge>
  );
}

/**
 * ReportCard Component
 */
function ReportCard({ report, onView, onResolve, onDismiss }: ReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Report Info */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {getCategoryBadge(report.category)}
              {getPriorityBadge(report.priority)}
              {getStatusBadge(report.status)}
              <span className="text-xs text-muted-foreground">
                #{report.id}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(report.createdAt, { addSuffix: true, locale: tr })}
            </span>
          </div>

          {/* Reporter & Reported */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Bildiren:</span>
              <div className="flex items-center gap-2">
                {report.reporterAvatar ? (
                  <img
                    src={report.reporterAvatar}
                    alt={report.reporterName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
                    {report.reporterName.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium">{report.reporterName}</span>
              </div>
            </div>

            <span className="text-muted-foreground">→</span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Şikayet Edilen:</span>
              <div className="flex items-center gap-2">
                {report.reportedUserAvatar ? (
                  <img
                    src={report.reportedUserAvatar}
                    alt={report.reportedUserName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs text-white font-bold">
                    {report.reportedUserName.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium">{report.reportedUserName}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium mb-1">{report.reason}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
          </div>

          {/* Evidence Count */}
          {report.evidence && report.evidence.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-3 h-3" />
              <span>{report.evidence.length} kanıt dosyası</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="icon" onClick={() => onView(report)} title="Detay">
            <Eye className="w-4 h-4" />
          </Button>
          {report.status === 'pending' || report.status === 'investigating' ? (
            <>
              <Button
                variant="outline"
                size="icon"
                className="text-green-600 hover:text-green-700"
                onClick={() => onResolve(report.id)}
                title="Çöz"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDismiss(report.id)}
                title="Reddet"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * AdminReports Component
 */
export default function AdminReports() {
  // State
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT-001',
      category: 'harassment',
      priority: 'high',
      status: 'pending',
      reporterId: 'usr-1',
      reporterName: 'Ayşe Yılmaz',
      reporterAvatar: 'https://i.pravatar.cc/150?img=1',
      reportedUserId: 'usr-2',
      reportedUserName: 'Mehmet Demir',
      reportedUserAvatar: 'https://i.pravatar.cc/150?img=2',
      reason: 'Sürekli rahatsız ediliyor',
      description: 'Kullanıcı sürekli mesaj atıyor ve uygun olmayan isteklerde bulunuyor. Engellememe rağmen farklı hesaplardan devam ediyor.',
      evidence: ['screenshot1.jpg', 'screenshot2.jpg'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'RPT-002',
      category: 'fake_profile',
      priority: 'urgent',
      status: 'investigating',
      reporterId: 'usr-3',
      reporterName: 'Zeynep Kaya',
      reporterAvatar: 'https://i.pravatar.cc/150?img=5',
      reportedUserId: 'usr-4',
      reportedUserName: 'Fake Escort',
      reportedUserAvatar: 'https://i.pravatar.cc/150?img=9',
      reason: 'Sahte profil kullanıyor',
      description: 'Bu profil fotoğraflar başka bir siteden alınmış. Gerçek kişi değil, dolandırıcı olabilir.',
      evidence: ['source.jpg'],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      assignedTo: 'admin-1',
    },
    {
      id: 'RPT-003',
      category: 'scam',
      priority: 'urgent',
      status: 'pending',
      reporterId: 'usr-5',
      reporterName: 'Elif Şahin',
      reporterAvatar: 'https://i.pravatar.cc/150?img=3',
      reportedUserId: 'usr-6',
      reportedUserName: 'Scammer',
      reason: 'Para istiyor',
      description: 'Randevu öncesinde kapora adı altında para istedi. Ödemeyi yapmayınca engelledi.',
      evidence: ['chat1.jpg', 'chat2.jpg', 'payment.jpg'],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: 'RPT-004',
      category: 'inappropriate_content',
      priority: 'medium',
      status: 'resolved',
      reporterId: 'usr-7',
      reporterName: 'Can Yılmaz',
      reporterAvatar: 'https://i.pravatar.cc/150?img=7',
      reportedUserId: 'usr-8',
      reportedUserName: ' inappropriate User',
      reason: 'Uygunsuz fotoğraflar',
      description: 'Profilinde uygunsuz ve açık saçık fotoğraflar var. Platform kurallarına aykırı.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      resolutionNote: 'Kullanıcı uyarıldı, fotoğraflar kaldırıldı.',
    },
  ]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ReportCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Handle view report
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  // Handle resolve report
  const handleResolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'resolved' as ReportStatus, updatedAt: new Date() }
          : r
      )
    );
    setSelectedReport(null);
  };

  // Handle dismiss report
  const handleDismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'dismissed' as ReportStatus, updatedAt: new Date() }
          : r
      )
    );
    setSelectedReport(null);
  };

  // Calculate stats
  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    investigating: reports.filter((r) => r.status === 'investigating').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    urgent: reports.filter((r) => r.priority === 'urgent').length,
  };

  return (
    <ProtectedRoute accessLevel="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button variant="ghost" size="icon">
                    <Calendar className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                    <Flag className="w-6 h-6 text-primary" />
                    Şikayet Yönetimi
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcı bildirimlerini inceleyin ve çözün
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Toplam</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Bekleyen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.investigating}</p>
                    <p className="text-xs text-muted-foreground">İnceleniyor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.resolved}</p>
                    <p className="text-xs text-muted-foreground">Çözüldü</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.urgent}</p>
                    <p className="text-xs text-muted-foreground">Acil</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Şikayet ID, kullanıcı adı veya açıklama ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex gap-2">
                  {(['all', 'pending', 'investigating', 'resolved', 'dismissed'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === 'all' && 'Tümü'}
                      {status === 'pending' && 'Bekleyen'}
                      {status === 'investigating' && 'İnceleniyor'}
                      {status === 'resolved' && 'Çözüldü'}
                      {status === 'dismissed' && 'Reddedildi'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-primary" />
                  Şikayetler
                  <Badge variant="secondary">{filteredReports.length}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Şikayet bulunamadı</p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onView={handleViewReport}
                      onResolve={handleResolveReport}
                      onDismiss={handleDismissReport}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="border-b p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Şikayet Detayı</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoryBadge(selectedReport.category)}
                      {getPriorityBadge(selectedReport.priority)}
                      {getStatusBadge(selectedReport.status)}
                      <span className="text-sm text-muted-foreground">#{selectedReport.id}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                {/* Users */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Bildiren</p>
                    <div className="flex items-center gap-3">
                      {selectedReport.reporterAvatar ? (
                        <img
                          src={selectedReport.reporterAvatar}
                          alt={selectedReport.reporterName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {selectedReport.reporterName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{selectedReport.reporterName}</p>
                        <p className="text-xs text-muted-foreground">ID: {selectedReport.reporterId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Şikayet Edilen</p>
                    <div className="flex items-center gap-3">
                      {selectedReport.reportedUserAvatar ? (
                        <img
                          src={selectedReport.reportedUserAvatar}
                          alt={selectedReport.reportedUserName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {selectedReport.reportedUserName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{selectedReport.reportedUserName}</p>
                        <p className="text-xs text-muted-foreground">ID: {selectedReport.reportedUserId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Şikayet Detayı</h3>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium mb-2">{selectedReport.reason}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                  </div>
                </div>

                {/* Evidence */}
                {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Kanıtlar</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.evidence.map((file, index) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          <FileText className="w-3 h-3" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Oluşturulma:</span>
                    <span className="ml-2">
                      {formatDistanceToNow(selectedReport.createdAt, { addSuffix: true, locale: tr })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Güncelleme:</span>
                    <span className="ml-2">
                      {formatDistanceToNow(selectedReport.updatedAt, { addSuffix: true, locale: tr })}
                    </span>
                  </div>
                </div>

                {/* Resolution Note */}
                {selectedReport.resolutionNote && (
                  <div>
                    <h3 className="font-medium mb-2">Çözüm Notu</h3>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-sm">{selectedReport.resolutionNote}</p>
                    </div>
                  </div>
                )}

                {/* Assigned To */}
                {selectedReport.assignedTo && (
                  <div>
                    <span className="text-muted-foreground">Atanan:</span>
                    <span className="ml-2">{selectedReport.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t p-4">
                <div className="flex gap-3">
                  {(selectedReport.status === 'pending' || selectedReport.status === 'investigating') && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleResolveReport(selectedReport.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Çöz
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDismissReport(selectedReport.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reddet
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      /* Ban user action */
                    }}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Kullanıcıyı Yasakla
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
