/**
 * Reports Panel Component
 *
 * Panel for generating, viewing, and managing analytics reports.
 *
 * @module components/ReportsPanel
 * @category Components - Analytics
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Report, TimePeriod, TIME_PERIODS } from '@/types/analytics';
import {
  FileText,
  Download,
  Plus,
  Calendar,
  Filter,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileJson,
  FileOutput,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ReportsPanelProps {
  className?: string;
  userRole?: 'escort' | 'customer' | 'admin' | null;
}

const REPORT_TYPES = [
  { value: 'overview', label: 'Genel Bakış', icon: FileText, description: 'Tüm metriklerin özeti' },
  { value: 'traffic', label: 'Trafik Raporu', icon: Filter, description: 'Ziyaretçi ve sayfa görüntüleme' },
  { value: 'revenue', label: 'Gelir Raporu', icon: FileSpreadsheet, description: 'Finansal performans' },
  { value: 'engagement', label: 'Etkileşim Raporu', icon: Eye, description: 'Mesaj ve randevu istatistikleri' },
  { value: 'performance', label: 'Performans Raporu', icon: FileOutput, description: 'Dönüşüm ve yanıt süreleri' },
] as const;

export function ReportsPanel({ className = '', userRole }: ReportsPanelProps) {
  const { generateReport, exportReport } = useAnalytics({ autoRefresh: false });
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<Report['type']>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('last7days');

  /**
   * Generate a new report
   */
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const newReport = await generateReport(selectedType);
      setReports(prev => [newReport, ...prev]);
      setShowCreateDialog(false);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Export a report
   */
  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    if (!selectedReport) return;

    await exportReport(format);
  };

  /**
   * Delete a report
   */
  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    if (selectedReport?.id === reportId) {
      setSelectedReport(null);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Raporlar</h2>
          <p className="text-muted-foreground">
            Analitik raporları oluşturun ve yönetin
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Rapor
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yeni Rapor Oluştur</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rapor Türü
                </label>
                <div className="space-y-2">
                  {REPORT_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <type.icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dönem
                </label>
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as TimePeriod)}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PERIODS.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>Oluşturuluyor...</>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Rapor Oluştur
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report List */}
      {reports.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="font-semibold mb-2">Henüz Rapor Yok</h3>
          <p className="text-muted-foreground mb-4">
            İlk analitik raporunuzu oluşturmak için yukarıdaki butona tıklayın.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-5 cursor-pointer transition-all hover:shadow-lg ${
                  selectedReport?.id === report.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary">{report.type}</Badge>
                </div>

                <h3 className="font-bold mb-1">{report.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {report.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {format(report.generatedAt, 'dd MMM yyyy, HH:mm', { locale: tr })}
                  </span>
                  <span>{report.metrics.length} metrik</span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Görüntüle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(report.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Report Detail */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{selectedReport.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                </div>

                <div className="flex gap-2">
                  {/* Export buttons */}
                  {(['pdf', 'excel', 'csv', 'json'] as const).map(format => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(format)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedReport.metrics.map(metric => (
                  <div key={metric.id} className="p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value.formattedValue}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.value.trend === 'up' && <span className="text-green-500 text-xs">↑</span>}
                      {metric.value.trend === 'down' && <span className="text-red-500 text-xs">↓</span>}
                      {metric.value.trendPercent !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {Math.abs(metric.value.trendPercent).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts summary */}
              <div>
                <h4 className="font-bold mb-3">Grafikler ({selectedReport.charts.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.charts.map((chart, index) => (
                    <Badge key={index} variant="outline">
                      {chart.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { ReportsPanel as default };
