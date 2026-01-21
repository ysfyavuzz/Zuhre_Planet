/**
 * PaymentMethodForm Component
 *
 * Credit card and payment method input form with validation.
 * Supports card number formatting, expiry date, and CVV validation.
 *
 * @module components/PaymentMethodForm
 * @category Components - Payment
 *
 * Features:
 * - Credit card number formatting with spaces
 * - Card type detection (Visa, Mastercard, Amex)
 * - Expiry date formatting (MM/YY)
 * - CVV validation
 * - Cardholder name
 * - Save card option
 * - Multiple saved cards management
 * - Card preview with animation
 * - Form validation
 * - Turkish lira support
 *
 * @example
 * ```tsx
 * <PaymentMethodForm
 *   onSubmit={handlePaymentSubmit}
 *   savedCards={userCards}
 *   loading={false}
 *   showSaveOption={true}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CreditCard, Lock, Trash2, Edit2, Check, AlertCircle,
  Apple, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Card type enum
 */
export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

/**
 * Payment method interface
 */
export interface PaymentMethod {
  id: string;
  type: CardType;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault?: boolean;
  createdAt: Date;
}

/**
 * Card form data interface
 */
export interface CardFormData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard: boolean;
}

/**
 * Props for PaymentMethodForm component
 */
export interface PaymentMethodFormProps {
  /**
   * Form submit handler
   */
  onSubmit: (data: CardFormData & { paymentMethodId?: string }) => void | Promise<void>;
  /**
   * Saved payment methods
   */
  savedCards?: PaymentMethod[];
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Show save card option
   */
  showSaveOption?: boolean;
  /**
   * Disable saved cards selection
   */
  disableSavedCards?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Detect card type from card number
 */
function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, '');

  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';

  return 'unknown';
}

/**
 * Format card number with spaces
 */
function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').substring(0, 19);
}

/**
 * Format expiry date
 */
function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '').substring(0, 4);
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Get card icon component
 */
function getCardIcon(type: CardType) {
  const icons = {
    visa: <CreditCard className="w-8 h-5 text-blue-500" />,
    mastercard: <CreditCard className="w-8 h-5 text-red-500" />,
    amex: <CreditCard className="w-8 h-5 text-amber-500" />,
    unknown: <CreditCard className="w-8 h-5 text-muted-foreground" />,
  };

  return icons[type];
}

/**
 * Get card type name
 */
function getCardTypeName(type: CardType): string {
  const names = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    unknown: 'Kart',
  };

  return names[type];
}

/**
 * PaymentMethodForm Component
 *
 * Main payment method form component.
 */
export default function PaymentMethodForm({
  onSubmit,
  savedCards = [],
  loading = false,
  showSaveOption = true,
  disableSavedCards = false,
  className = '',
}: PaymentMethodFormProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(
    savedCards.find(c => c.isDefault)?.id
  );
  const [showNewCardForm, setShowNewCardForm] = useState(
    !savedCards.length || disableSavedCards
  );

  // Form state
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CardFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CardFormData, boolean>>>({});

  // Card type detection
  const cardType = useMemo(() => {
    return detectCardType(formData.cardNumber);
  }, [formData.cardNumber]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CardFormData, string>> = {};

    // Card number validation
    const cleanedNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cleanedNumber || cleanedNumber.length < 13 || cleanedNumber.length > 19) {
      newErrors.cardNumber = 'Geçersiz kart numarası';
    }

    // Cardholder name validation
    if (!formData.cardholderName || formData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Kart sahibi adı gerekli';
    }

    // Expiry validation
    const month = parseInt(formData.expiryMonth);
    const year = parseInt(formData.expiryYear);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (!month || month < 1 || month > 12) {
      newErrors.expiryMonth = 'Geçersiz ay';
    }

    if (!year || year < currentYear || (year === currentYear && month < currentMonth)) {
      newErrors.expiryYear = 'Kart süresi geçmiş';
    }

    // CVV validation
    const cvvLength = cardType === 'amex' ? 4 : 3;
    if (!formData.cvv || formData.cvv.length !== cvvLength) {
      newErrors.cvv = `CVV ${cvvLength} haneli olmalı`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (
    field: keyof CardFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle card number input
  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleInputChange('cardNumber', formatted);
  };

  // Handle expiry date input
  const handleExpiryChange = (field: 'expiryMonth' | 'expiryYear', value: string) => {
    if (value.length > 2) return;
    handleInputChange(field, value);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedCardId) {
      await onSubmit({ ...formData, paymentMethodId: selectedCardId });
    } else {
      await onSubmit(formData);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Saved Cards */}
      {savedCards.length > 0 && !disableSavedCards && (
        <div className="space-y-3">
          <span className="text-base font-semibold">Kayıtlı Kartlar</span>
          <div className="space-y-2">
            {savedCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                  selectedCardId === card.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => {
                  setSelectedCardId(card.id);
                  setShowNewCardForm(false);
                }}
              >
                <Card className="border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getCardIcon(card.type)}
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {getCardTypeName(card.type)}
                            {card.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Varsayılan
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            •••• •••• •••• {card.last4}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
                          </div>
                        </div>
                      </div>
                      {selectedCardId === card.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add new card option */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: savedCards.length * 0.05 }}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all ${
                showNewCardForm ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setShowNewCardForm(true);
                setSelectedCardId(undefined);
              }}
            >
              <Card className="border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">Yeni Kart Ekle</div>
                      <div className="text-sm text-muted-foreground">Başka bir kart kullanın</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* New Card Form */}
      {showNewCardForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Kart Numarası</span>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, cardNumber: true }))}
                      className={`pr-12 ${errors.cardNumber && touched.cardNumber ? 'border-red-500' : ''}`}
                      maxLength={19}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getCardIcon(cardType)}
                    </div>
                  </div>
                  {errors.cardNumber && touched.cardNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Kart Sahibi</span>
                  <Input
                    id="cardholderName"
                    placeholder="AD SOYAD"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, cardholderName: true }))}
                    className={errors.cardholderName && touched.cardholderName ? 'border-red-500' : ''}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.cardholderName && touched.cardholderName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Son Kullanma</span>
                    <div className="flex gap-2">
                      <Input
                        placeholder="AA"
                        value={formData.expiryMonth}
                        onChange={(e) => handleExpiryChange('expiryMonth', e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, expiryMonth: true }))}
                        className={errors.expiryMonth && touched.expiryMonth ? 'border-red-500' : ''}
                        maxLength={2}
                      />
                      <Input
                        placeholder="YY"
                        value={formData.expiryYear}
                        onChange={(e) => handleExpiryChange('expiryYear', e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, expiryYear: true }))}
                        className={errors.expiryYear && touched.expiryYear ? 'border-red-500' : ''}
                        maxLength={2}
                      />
                    </div>
                    {(errors.expiryMonth && touched.expiryMonth) || (errors.expiryYear && touched.expiryYear) ? (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.expiryMonth || errors.expiryYear}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">CVV</span>
                    <Input
                      id="cvv"
                      placeholder="•••"
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      onBlur={() => setTouched(prev => ({ ...prev, cvv: true }))}
                      className={errors.cvv && touched.cvv ? 'border-red-500' : ''}
                      maxLength={cardType === 'amex' ? 4 : 3}
                    />
                    {errors.cvv && touched.cvv && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Card */}
                {showSaveOption && (
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="saveCard"
                      checked={formData.saveCard}
                      onCheckedChange={(checked) => handleInputChange('saveCard', checked as boolean)}
                    />
                    <span className="text-sm cursor-pointer">
                      Kartı gelecekteki işlemler için kaydet
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                  {!loading && <Lock className="w-4 h-4 ml-2" />}
                </Button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>256-bit SSL şifreleme ile korunuyor</span>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Saved Card Selected - Submit Button */}
      {selectedCardId && !showNewCardForm && (
        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
          {!loading && <Lock className="w-4 h-4 ml-2" />}
        </Button>
      )}
    </div>
  );
}

/**
 * Compact payment method selector
 */
export function PaymentMethodSelector({
  selectedCard,
  onSelect,
  cards,
}: {
  selectedCard?: string;
  onSelect: (cardId: string) => void;
  cards: PaymentMethod[];
}) {
  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onSelect(card.id)}
          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
            selectedCard === card.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {getCardIcon(card.type)}
            <div className="flex-1">
              <div className="font-medium">•••• {card.last4}</div>
              <div className="text-xs text-muted-foreground">
                {card.expiryMonth}/{String(card.expiryYear).slice(-2)}
              </div>
            </div>
            {selectedCard === card.id && (
              <Check className="w-5 h-5 text-primary" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
