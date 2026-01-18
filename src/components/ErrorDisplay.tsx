import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle, RefreshCw, Home, ArrowLeft,
  WifiOff, ServerCrash, Lock, SearchX, FileQuestion
} from 'lucide-react';

/**
 * ErrorDisplay - Centralized error display component
 * Provides consistent error experiences across the app
 */

// ─────────────────────────────────────────────────────────────────────────────
// ERROR TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ErrorType =
  | 'network'      // Connection issues
  | 'server'       // Server errors (5xx)
  | 'notFound'     // 404 errors
  | 'unauthorized' // 401/403 errors
  | 'validation'   // Form validation errors
  | 'unknown';     // Fallback

export interface ErrorDisplayProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
  retryCount?: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR ICONS & CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const ERROR_CONFIG = {
  network: {
    icon: WifiOff,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    title: 'Bağlantı Hatası',
    message: 'İnternet bağlantınızı kontrol edip tekrar deneyin.',
    retryable: true
  },
  server: {
    icon: ServerCrash,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    title: 'Sunucu Hatası',
    message: 'Sunucuda bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
    retryable: true
  },
  notFound: {
    icon: SearchX,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'İçerik Bulunamadı',
    message: 'Aradığınız içerik bulunamadı veya kaldırılmış olabilir.',
    retryable: false
  },
  unauthorized: {
    icon: Lock,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    title: 'Erişim Reddedildi',
    message: 'Bu sayfaya erişim izniniz yok. Lütfen giriş yapın.',
    retryable: false
  },
  validation: {
    icon: AlertCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    title: 'Doğrulama Hatası',
    message: 'Girdiğiniz bilgilerde bir sorun var. Lütfen kontrol edin.',
    retryable: false
  },
  unknown: {
    icon: FileQuestion,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    title: 'Beklenmeyen Hata',
    message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    retryable: true
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ERROR DISPLAY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function ErrorDisplay({
  type = 'unknown',
  title,
  message,
  onRetry,
  onGoBack,
  onGoHome,
  retryCount = 0,
  className = ''
}: ErrorDisplayProps) {
  const config = ERROR_CONFIG[type];
  const Icon = config.icon;

  const maxRetries = 3;
  const canRetry = config.retryable && retryCount < maxRetries;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full ${config.bg} flex items-center justify-center`}
          >
            <Icon className={`w-10 h-10 ${config.color}`} />
          </motion.div>

          {/* Error Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            {title || config.title}
          </motion.h2>

          {/* Error Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-6"
          >
            {message || config.message}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {canRetry && onRetry && (
              <Button
                onClick={onRetry}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tekrar Dene
                {retryCount > 0 && ` (${retryCount}/${maxRetries})`}
              </Button>
            )}

            {onGoBack && (
              <Button
                variant="outline"
                onClick={onGoBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Button>
            )}

            {onGoHome && (
              <Button
                variant="outline"
                onClick={onGoHome}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Button>
            )}
          </motion.div>

          {/* Retry Exhausted Message */}
          {retryCount >= maxRetries && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mt-4"
            >
              Maksimum deneme sayısına ulaşıldı. Lütfen daha sonra tekrar deneyin veya destek ile iletişime geçin.
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZED ERROR DISPLAYS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * InlineError - Compact inline error display
 */
export interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
}

export function InlineError({ message, onDismiss }: InlineErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
    >
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-600 transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}

/**
 * FormFieldError - Form field error display
 */
export interface FormFieldErrorProps {
  error?: string;
  id?: string;
}

export function FormFieldError({ error, id }: FormFieldErrorProps) {
  if (!error) return null;

  return (
    <motion.p
      id={id}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-500 mt-1 flex items-center gap-1"
    >
      <AlertCircle className="w-3 h-3" />
      {error}
    </motion.p>
  );
}

/**
 * FullPageError - Full page error display
 */
export function FullPageError(props: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ErrorDisplay {...props} />
    </div>
  );
}

/**
 * NetworkError - Specialized network error
 */
export function NetworkError({ onRetry, retryCount }: { onRetry?: () => void; retryCount?: number }) {
  return (
    <FullPageError
      type="network"
      onRetry={onRetry}
      onGoHome={() => window.location.href = '/'}
      retryCount={retryCount}
    />
  );
}

/**
 * ServerError - Specialized server error
 */
export function ServerError({ onRetry, retryCount }: { onRetry?: () => void; retryCount?: number }) {
  return (
    <FullPageError
      type="server"
      onRetry={onRetry}
      onGoHome={() => window.location.href = '/'}
      retryCount={retryCount}
    />
  );
}

/**
 * NotFoundError - 404 error page
 */
export function NotFoundError({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <FullPageError
      type="notFound"
      onGoHome={onGoHome || (() => window.location.href = '/')}
    />
  );
}

/**
 * UnauthorizedError - 401/403 error page
 */
export function UnauthorizedError({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <FullPageError
      type="unauthorized"
      onGoHome={onGoHome || (() => window.location.href = '/')}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY FALLBACK
// ─────────────────────────────────────────────────────────────────────────────

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-center mb-4">
            Bir Şeyler Yanlış Gitti
          </h2>

          {/* Error Message */}
          <p className="text-center text-muted-foreground mb-6">
            Uygulamada beklenmeyen bir hata oluştu. Hata detayları geliştiricilere iletildi.
          </p>

          {/* Error Details (Dev Only) */}
          {isDev && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-mono text-red-500 hover:text-red-600">
                Hata Detayları (Geliştirici Modu)
              </summary>
              <pre className="mt-3 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-64">
                {error.name}: {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tekrar Dene
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST ERROR MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'İnternet bağlantınızı kontrol edin',
  TIMEOUT_ERROR: 'İstek zaman aşımına uğradı. Tekrar deneyin',
  SERVER_UNAVAILABLE: 'Sunucu şu anda kullanılamıyor',

  // Auth errors
  UNAUTHORIZED: 'Oturum süreniz doldu. Tekrar giriş yapın',
  INVALID_CREDENTIALS: 'Kullanıcı adı veya şifre hatalı',
  SESSION_EXPIRED: 'Oturum süreniz doldu',

  // Validation errors
  REQUIRED_FIELD: 'Bu alan zorunludur',
  INVALID_EMAIL: 'Geçerli bir e-posta adresi girin',
  INVALID_PHONE: 'Geçerli bir telefon numarası girin',
  PASSWORD_TOO_SHORT: 'Şifre en az 6 karakter olmalı',
  PASSWORDS_NOT_MATCH: 'Şifreler eşleşmiyor',

  // Resource errors
  NOT_FOUND: 'İçerik bulunamadı',
  ALREADY_EXISTS: 'Bu zaten mevcut',
  CONFLICT: 'Çakışma var, lütfen tekrar deneyin',

  // Permission errors
  FORBIDDEN: 'Bu işlem için yetkiniz yok',
  ACCESS_DENIED: 'Erişim reddedildi',

  // Generic errors
  GENERIC_ERROR: 'Bir hata oluştu. Lütfen tekrar deneyin',
  UNKNOWN_ERROR: 'Beklenmeyen bir hata oluştu'
} as const;

/**
 * GetErrorMessage - Convert error code to user-friendly message
 */
export function getErrorMessage(errorCode: keyof typeof ERROR_MESSAGES): string {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.GENERIC_ERROR;
}

/**
 * Determine error type from error object
 */
export function getErrorType(error: Error | { status?: number; code?: string }): ErrorType {
  // Network errors
  if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
    return 'network';
  }

  // HTTP status errors
  if ('status' in error) {
    if (error.status === 404) return 'notFound';
    if (error.status === 401 || error.status === 403) return 'unauthorized';
    if (error.status && error.status >= 500) return 'server';
    if (error.status && error.status >= 400) return 'validation';
  }

  return 'unknown';
}
