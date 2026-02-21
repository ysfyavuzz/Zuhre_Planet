/**
 * Review Form Component
 *
 * Multi-step review submission form with criteria ratings and photo uploads.
 * Features validation, auto-save draft, and tag selection.
 *
 * @module components/ReviewForm
 * @category Components - Reviews
 */

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Image as ImageIcon,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Review,
  ReviewCriteria,
  RatingValue,
  REVIEW_TAGS,
  REVIEW_VALIDATION,
  DEFAULT_REVIEW_CRITERIA,
  REVIEW_CRITERIA_INFO,
  canSubmitReview,
} from '@/types/reviewsExtended';
import { InteractiveRating, MultiCriteriaRating } from './Rating';

interface ReviewFormProps {
  escortId: string;
  escortName: string;
  bookingId?: string;
  isVerifiedBooking?: boolean;
  initialData?: Partial<Review>;
  onSubmit: (review: Partial<Review>) => Promise<void>;
  onCancel?: () => void;
  onSaveDraft?: (draft: any) => void;
  submitLabel?: string;
  className?: string;
}

export function ReviewForm({
  escortId,
  escortName,
  bookingId,
  isVerifiedBooking = false,
  initialData,
  onSubmit,
  onCancel,
  onSaveDraft,
  submitLabel = 'Değerlendirmeyi Gönder',
  className = '',
}: ReviewFormProps) {
  // Form state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rating, setRating] = useState<RatingValue | null>(initialData?.rating || null);
  const [criteria, setCriteria] = useState<ReviewCriteria>(
    initialData?.criteria || DEFAULT_REVIEW_CRITERIA
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Validation
  const validateStep = (currentStep: 1 | 2 | 3): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!rating) {
        newErrors.rating = 'Lütfen genel puan verin';
      }
    }

    if (currentStep === 2) {
      if (!title || title.length < REVIEW_VALIDATION.title.minLength) {
        newErrors.title = `Başlık en az ${REVIEW_VALIDATION.title.minLength} karakter olmalı`;
      }
      if (!content || content.length < REVIEW_VALIDATION.content.minLength) {
        newErrors.content = `Yorum en az ${REVIEW_VALIDATION.content.minLength} karakter olmalı`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle photo upload
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate files
    const validFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      const isValidType = REVIEW_VALIDATION.photos.allowedTypes.some(type =>
        fileType === type.toLowerCase() || fileType.includes(type.split('/')[1])
      );

      if (!isValidType) {
        alert(`Geçersiz dosya formatı: ${file.type}`);
        return false;
      }
      if (file.size > REVIEW_VALIDATION.photos.maxSize) {
        alert(`Dosya çok büyük (max ${REVIEW_VALIDATION.photos.maxSize / 1024 / 1024}MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length + photos.length > REVIEW_VALIDATION.photos.maxCount) {
      alert(`En fazla ${REVIEW_VALIDATION.photos.maxCount} fotoğraf yükleyebilirsiniz`);
      return;
    }

    setPhotos(prev => [...prev, ...validFiles]);
  }, [photos]);

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle tag
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(t => t !== tagId);
      } else if (prev.length < REVIEW_VALIDATION.tags.maxCount) {
        return [...prev, tagId];
      }
      return prev;
    });
  };

  // Auto-save draft
  useEffect(() => {
    if (!rating && !title && !content) return;

    const draft = {
      bookingId,
      escortId,
      rating,
      criteria,
      title,
      content,
      photos,
      tags: selectedTags,
      timestamp: new Date(),
    };

    const timer = setTimeout(() => {
      onSaveDraft?.(draft);
      setSaveStatus('saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [rating, criteria, title, content, selectedTags, photos, bookingId, escortId, onSaveDraft]);

  // Submit review
  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        escortId,
        escortName,
        bookingId,
        isVerifiedBooking,
        rating: rating!,
        criteria,
        title,
        content,
        tags: selectedTags,
        photos: photos.map((file, index) => ({
          id: `photo-${index}`,
          url: URL.createObjectURL(file),
          thumbnailUrl: URL.createObjectURL(file),
          status: 'pending' as const,
        })),
      });

      // Reset form or redirect
    } catch (error) {
      setErrors({ submit: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step as 1 | 2)) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Değerlendirme Yaz</h2>
          <p className="text-sm text-muted-foreground">
            {escortName} için deneyiminizi paylaşın
          </p>
        </div>
        {isVerifiedBooking && (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Onaylı Randevu
          </Badge>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <motion.div
              animate={{ scale: [1, 1] }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= stepNumber
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }`}
            >
              {stepNumber}
            </motion.div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-1 ${step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Rating */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Genel Puanınız</h3>
                <InteractiveRating
                  value={rating}
                  onChange={setRating}
                  size="lg"
                  error={errors.rating}
                  required
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-bold text-lg mb-4">Detaylı Puanlar</h3>
                <MultiCriteriaRating
                  criteria={criteria}
                  onChange={(newCriteria) => setCriteria(newCriteria as typeof criteria)}
                  size="md"
                />
              </div>

              <Button
                onClick={nextStep}
                disabled={!rating}
                className="w-full"
                size="lg"
              >
                Devam Et
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Content */}
      <AnimatePresence mode="wait">
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Başlık *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Deneyiminizi özetleyen başlık"
                  maxLength={REVIEW_VALIDATION.title.maxLength}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {title.length} / {REVIEW_VALIDATION.title.maxLength}
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Yorumunuz *
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Deneyiminizi detaylı şekilde paylaşın..."
                  rows={6}
                  maxLength={REVIEW_VALIDATION.content.maxLength}
                  className={errors.content ? 'border-red-500' : ''}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {content.length} / {REVIEW_VALIDATION.content.maxLength}
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Etiketler (Seçimli, max 5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_TAGS.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                      className={`cursor-pointer hover:opacity-80 transition-opacity ${tag.category === 'positive' && selectedTags.includes(tag.id)
                          ? 'bg-green-500'
                          : tag.category === 'negative' && selectedTags.includes(tag.id)
                            ? 'bg-red-500'
                            : ''
                        }`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.icon && <span className="mr-1">{tag.icon}</span>}
                      {tag.label}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedTags.length} / {REVIEW_VALIDATION.tags.maxCount} seçildi
                </p>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Fotoğraflar (Opsiyonel, max {REVIEW_VALIDATION.photos.maxCount})
                </label>
                <div className="space-y-3">
                  {/* Photo previews */}
                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('photo-upload')?.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Fotoğraf Yükle
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Geri
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!title || !content}
                  className="flex-1"
                >
                  Devam Et
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: Review & Submit */}
      <AnimatePresence mode="wait">
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="space-y-6">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h3 className="font-bold mb-4">Özet</h3>

                {/* Rating summary */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {rating}
                    </div>
                    <Star className="w-6 h-6 text-cyan-400 fill-cyan-400 mx-auto mt-1" />
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    {Object.entries(criteria).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-muted-foreground text-xs">
                          {REVIEW_CRITERIA_INFO[key as keyof typeof REVIEW_CRITERIA_INFO]?.label}
                        </div>
                        <div className="font-bold">{value}.0</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                {title && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Başlık</p>
                    <p className="font-medium">{title}</p>
                  </div>
                )}

                {/* Content preview */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Yorum</p>
                  <p className="text-sm line-clamp-3">{content}</p>
                </div>

                {/* Tags */}
                {selectedTags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Etiketler</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map(tagId => {
                        const tag = REVIEW_TAGS.find(t => t.id === tagId);
                        return tag ? (
                          <Badge key={tagId} variant="secondary">
                            {tag.icon && <span className="mr-1">{tag.icon}</span>}
                            {tag.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Geri
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {submitLabel}
                    </>
                  )}
                </Button>
              </div>

              {/* Cancel */}
              {onCancel && (
                <Button variant="ghost" onClick={onCancel} className="w-full">
                  İptal
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-save indicator */}
      {saveStatus === 'saved' && (
        <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
          <Save className="w-4 h-4 mr-2" />
          Taslak kaydedildi
        </div>
      )}
    </Card>
  );
}

export { ReviewForm as default };
