/**
 * InvoiceHistory Component
 *
 * Invoice history display with download, filter, and details view.
 * Shows past payments, invoices, and billing history.
 *
 * @module components/InvoiceHistory
 * @category Components - Payment
 *
 * Features:
 * - Invoice list with status badges
 * - Filter by date range and status
 * - Invoice download (PDF)
 * - Invoice detail view
 * - Payment status tracking
 * - Amount summary
 * - Pagination
 * - Search functionality
 *
 * @example
 * ```tsx
 * <InvoiceHistory
 *   invoices={userInvoices}
 *   onDownload={handleDownload}
 *   onViewDetails={handleViewDetails}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Download, FileText, Calendar, CreditCard, CheckCircle2,
  Clock, XCircle, AlertCircle, Search, Filter, ChevronDown,
  Eye, Trash2, RefreshCw, Receipt
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Invoice status type
 */
export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

/**
 * Invoice interface
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  date: Date;
  dueDate?: Date;
  description: string;
  plan: string;
  billingCycle: string;
  paymentMethod?: string;
  downloadUrl?: string;
}

/**
 * Props for InvoiceHistory component
 */
export interface InvoiceHistoryProps {
  /**
   * Invoice list
   */
  invoices: Invoice[];
  /**
   * Download handler
   */
  onDownload?: (invoiceId: string) => void | Promise<void>;
  /**
   * View details handler
   */
  onViewDetails?: (invoiceId: string) => void;
  /**
   * Show filters
   */
  showFilters?: boolean;
  /**
   * Compact mode
   */
  compact?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Get status configuration
 */
function getStatusConfig(status: InvoiceStatus) {
  const configs = {
    paid: {
      label: 'Ödendi',
      color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      icon: CheckCircle2,
    },
    pending: {
      label: 'Bekliyor',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      icon: Clock,
    },
    failed: {
      label: 'Başarısız',
      color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      icon: XCircle,
    },
    refunded: {
      label: 'İade Edildi',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      icon: RefreshCw,
    },
  };

  return configs[status];
}

/**
 * Format currency
 */
function formatCurrency(amount: number, currency: string = '₺'): string {
  return `${currency}${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * InvoiceHistory Component
 *
 * Main invoice history component with filtering.
 */
export default function InvoiceHistory({
  invoices,
  onDownload,
  onViewDetails,
  showFilters = true,
  compact = false,
  className = '',
}: InvoiceHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Status filter
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.description.toLowerCase().includes(query) ||
          invoice.plan.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Calculate summary
  const summary = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0);
    const pending = invoices.reduce((sum, inv) => sum + (inv.status === 'pending' ? inv.amount : 0), 0);
    const paidCount = invoices.filter(inv => inv.status === 'paid').length;
    const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

    return { total, pending, paidCount, pendingCount };
  }, [invoices]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fatura Geçmişi</h2>
          <p className="text-muted-foreground">
            Toplam {invoices.length} fatura
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ödenen Toplam</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(summary.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bekleyen</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(summary.pending)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Receipt className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Fatura</p>
                  <p className="text-lg font-bold">{invoices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Fatura ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Tümü ({invoices.length})
            </Button>
            <Button
              variant={statusFilter === 'paid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('paid')}
            >
              Ödendi ({summary.paidCount})
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Bekliyor ({summary.pendingCount})
            </Button>
            <Button
              variant={statusFilter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('failed')}
            >
              Başarısız
            </Button>
          </div>
        </div>
      )}

      {/* Invoice List */}
      <div className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">Fatura Bulunamadı</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Filtre kriterlerinize uygun fatura bulunamadı.'
                  : 'Henüz faturanız yok.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice, index) => {
            const statusConfig = getStatusConfig(invoice.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedInvoice === invoice.id;

            return (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isExpanded ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    if (onViewDetails) {
                      onViewDetails(invoice.id);
                    } else {
                      setExpandedInvoice(isExpanded ? null : invoice.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left - Invoice Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${statusConfig.color}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{invoice.invoiceNumber}</h3>
                            <Badge variant="outline" className={statusConfig.color}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>

                          {!compact && isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-2 text-sm"
                            >
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                <div>
                                  <span className="text-muted-foreground">Plan:</span>
                                  <span className="ml-2 font-medium">{invoice.plan}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Dönem:</span>
                                  <span className="ml-2 font-medium">{invoice.billingCycle}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Tarih:</span>
                                  <span className="ml-2 font-medium">
                                    {new Date(invoice.date).toLocaleDateString('tr-TR')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Ödeme:</span>
                                  <span className="ml-2 font-medium">{invoice.paymentMethod || 'Kredi Kartı'}</span>
                                </div>
                              </div>

                              {invoice.dueDate && invoice.status === 'pending' && (
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                  <Clock className="w-4 h-4" />
                                  <span>Son ödeme: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}</span>
                                </div>
                              )}
                            </motion.div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDistanceToNow(new Date(invoice.date), { addSuffix: true, locale: tr })}
                            </span>
                            {invoice.paymentMethod && !isExpanded && (
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {invoice.paymentMethod}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right - Amount & Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {invoice.billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          {onDownload && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownload(invoice.id);
                              }}
                              title="Faturayı İndir"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {onViewDetails && !isExpanded && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(invoice.id);
                              }}
                              title="Detayları Gör"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedInvoice(isExpanded ? null : invoice.id);
                            }}
                            title={isExpanded ? 'Daralt' : 'Genişlet'}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination (Mock) */}
      {filteredInvoices.length > 10 && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm">
            Daha Fazla Yükle
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Compact invoice list for embedding in cards
 */
export function InvoiceListCompact({
  invoices,
  onDownload,
  limit = 5,
}: {
  invoices: Invoice[];
  onDownload?: (invoiceId: string) => void;
  limit?: number;
}) {
  const displayInvoices = invoices.slice(0, limit);

  return (
    <div className="space-y-2">
      {displayInvoices.map((invoice) => {
        const statusConfig = getStatusConfig(invoice.status);
        return (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(invoice.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {formatCurrency(invoice.amount, invoice.currency)}
              </span>
              <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDownload(invoice.id)}
                >
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
