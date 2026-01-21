/**
 * Report Escort Dialog Component
 *
 * Modal dialog for customers to report/complain about escorts.
 * Supports multiple report types with detailed descriptions.
 *
 * @module components/ReportEscortDialog
 * @category Components - Customer
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertTriangle, Flag, UserX, ShieldAlert, Ban,
    MessageSquareWarning, FileWarning, CheckCircle2,
    Loader2, X, Send, AlertCircle
} from 'lucide-react';

/**
 * Report reason types
 */
export type ReportReason =
    | 'fake_profile'
    | 'fraud'
    | 'inappropriate'
    | 'scam'
    | 'harassment'
    | 'not_as_described'
    | 'safety_concern'
    | 'other';

/**
 * Report reason configuration
 */
const REPORT_REASONS: Record<ReportReason, {
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
}> = {
    fake_profile: {
        label: 'Sahte Profil',
        description: 'Fotoğraflar veya bilgiler gerçeği yansıtmıyor',
        icon: UserX,
        color: 'text-orange-500',
    },
    fraud: {
        label: 'Sahtekarlık',
        description: 'Para dolandırıcılığı veya aldatma girişimi',
        icon: AlertTriangle,
        color: 'text-red-500',
    },
    scam: {
        label: 'Dolandırıcılık',
        description: 'Ödeme aldı ama hizmet vermedi',
        icon: Ban,
        color: 'text-red-600',
    },
    inappropriate: {
        label: 'Uygunsuz İçerik',
        description: 'Kural dışı veya yasadışı içerik',
        icon: FileWarning,
        color: 'text-amber-500',
    },
    harassment: {
        label: 'Taciz',
        description: 'Rahatsız edici mesajlar veya davranışlar',
        icon: MessageSquareWarning,
        color: 'text-purple-500',
    },
    not_as_described: {
        label: 'Açıklamaya Uygun Değil',
        description: 'Hizmet veya profil açıklamasına uymuyor',
        icon: Flag,
        color: 'text-blue-500',
    },
    safety_concern: {
        label: 'Güvenlik Endişesi',
        description: 'Kişisel güvenlik tehdidi veya şüpheli davranış',
        icon: ShieldAlert,
        color: 'text-red-500',
    },
    other: {
        label: 'Diğer',
        description: 'Yukarıdaki kategorilere uymayan diğer sorunlar',
        icon: AlertCircle,
        color: 'text-gray-500',
    },
};

/**
 * Report data interface
 */
export interface ReportData {
    escortId: string;
    escortName: string;
    reason: ReportReason;
    description: string;
    bookingId?: string;
}

/**
 * Props for ReportEscortDialog
 */
interface ReportEscortDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    escortId: string;
    escortName: string;
    escortPhoto?: string;
    bookingId?: string;
    onSubmit?: (data: ReportData) => Promise<void>;
}

/**
 * Report Escort Dialog Component
 */
export function ReportEscortDialog({
    open,
    onOpenChange,
    escortId,
    escortName,
    escortPhoto,
    bookingId,
    onSubmit,
}: ReportEscortDialogProps) {
    const [step, setStep] = useState<'reason' | 'details' | 'success'>('reason');
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when dialog opens
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setTimeout(() => {
                setStep('reason');
                setSelectedReason(null);
                setDescription('');
                setError(null);
            }, 200);
        }
        onOpenChange(newOpen);
    };

    // Handle reason selection
    const handleReasonSelect = (reason: ReportReason) => {
        setSelectedReason(reason);
        setStep('details');
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!selectedReason) return;

        if (description.trim().length < 20) {
            setError('Lütfen en az 20 karakter açıklama yazın.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            if (onSubmit) {
                await onSubmit({
                    escortId,
                    escortName,
                    reason: selectedReason,
                    description: description.trim(),
                    bookingId,
                });
            }
            setStep('success');
        } catch {
            setError('Şikayet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Go back to reason selection
    const handleBack = () => {
        setStep('reason');
        setError(null);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-500" />
                        İhbar / Şikayet
                    </DialogTitle>
                    <DialogDescription>
                        {escortName} hakkında şikayette bulunun. Tüm şikayetler gizli tutulur.
                    </DialogDescription>
                </DialogHeader>

                {/* Escort Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                        {escortPhoto ? (
                            <img src={escortPhoto} alt={escortName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                                {escortName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold">{escortName}</p>
                        <p className="text-sm text-muted-foreground">Şikayet edilecek profil</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Select Reason */}
                    {step === 'reason' && (
                        <motion.div
                            key="reason"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-2 max-h-[350px] overflow-y-auto"
                        >
                            <p className="text-sm font-medium mb-3">Şikayet sebebini seçin:</p>
                            {Object.entries(REPORT_REASONS).map(([key, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleReasonSelect(key as ReportReason)}
                                        className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-colors text-left"
                                    >
                                        <div className={`p-2 rounded-lg bg-muted/50 ${config.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{config.label}</p>
                                            <p className="text-sm text-muted-foreground">{config.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Step 2: Details */}
                    {step === 'details' && selectedReason && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {/* Selected Reason */}
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="gap-1">
                                    {(() => {
                                        const Icon = REPORT_REASONS[selectedReason].icon;
                                        return <Icon className="w-3 h-3" />;
                                    })()}
                                    {REPORT_REASONS[selectedReason].label}
                                </Badge>
                                <button
                                    onClick={handleBack}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Değiştir
                                </button>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Detaylı Açıklama <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Lütfen yaşadığınız sorunu detaylı bir şekilde açıklayın. Ne oldu? Ne zaman oldu? Hangi delillere sahipsiniz?"
                                    rows={5}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {description.length}/500 karakter (min: 20)
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Info */}
                            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                <p>⚠️ Şikayetiniz gizli tutulacak ve yöneticiler tarafından incelenecektir.</p>
                                <p className="mt-1">Yanlış veya asılsız ihbarlar hesabınızın kısıtlanmasına neden olabilir.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Şikayetiniz Alındı</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Şikayetiniz başarıyla iletildi. Yöneticilerimiz en kısa sürede inceleyecektir.
                            </p>
                            <Button onClick={() => handleOpenChange(false)}>
                                Kapat
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                {step === 'details' && (
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                            <X className="w-4 h-4 mr-2" />
                            Geri
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || description.trim().length < 20}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Şikayeti Gönder
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ReportEscortDialog;
