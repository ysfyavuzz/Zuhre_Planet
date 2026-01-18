import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { CardSkeleton, ProfileSkeleton, ListSkeleton, TableSkeleton, GallerySkeleton, TextBlockSkeleton, AvatarSkeleton, ButtonSkeleton, ReviewSkeleton, StatsCardSkeleton, FormSkeleton, MessageSkeleton, Skeleton } from './ui/skeleton';

/**
 * LoadingStates - Centralized loading component with animations
 * Provides consistent loading experiences across the app
 */

// ─────────────────────────────────────────────────────────────────────────────
// SPINNER VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className || ''}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE LOADING STATES
// ─────────────────────────────────────────────────────────────────────────────

interface PageLoadingProps {
  message?: string;
}

/**
 * FullPageLoading - Full screen page loader
 */
export function FullPageLoading({ message = 'Yükleniyor...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Animated Logo/Icon */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent"
        />

        <LoadingSpinner size="lg" text={message} />
      </motion.div>
    </div>
  );
}

/**
 * ContentLoading - In-content area loader
 */
export function ContentLoading({ message = 'Yükleniyor...' }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <LoadingSpinner size="md" text={message} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADING STATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CardGridLoading - Grid of card skeletons
 */
export function CardGridLoading({ count = 8 }: { count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * ProfilePageLoading - Full profile page skeleton
 */
export function ProfilePageLoading() {
  return <ProfileSkeleton />;
}

/**
 * ListLoading - List items skeleton
 */
export function ListLoading({ count = 5 }: { count?: number }) {
  return <ListSkeleton count={count} />;
}

/**
 * TableLoading - Table skeleton for admin
 */
export function TableLoading({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return <TableSkeleton rows={rows} columns={columns} />;
}

/**
 * GalleryLoading - Image gallery skeleton
 */
export function GalleryLoading({ count = 6 }: { count?: number }) {
  return <GallerySkeleton count={count} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE LOADING STATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * InlineLoading - Small inline loader
 */
export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="w-4 h-4 animate-spin" />
      {text && <span>{text}</span>}
    </div>
  );
}

/**
 * ButtonLoading - Button with loading state
 */
export function ButtonLoading({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <motion.button
      disabled
      className="px-4 py-2 rounded-full bg-primary text-primary-foreground flex items-center gap-2"
    >
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIZED LOADING STATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ChatLoading - Chat message typing indicator
 */
export function ChatLoading() {
  return (
    <div className="flex gap-3 max-w-xs">
      <AvatarSkeleton size="sm" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SearchLoading - Search results loading
 */
export function SearchLoading() {
  return (
    <div className="space-y-4">
      {/* Search bar skeleton */}
      <div className="p-4 rounded-xl bg-card border border-border/5">
        <div className="h-12 bg-muted rounded-xl animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      {/* Results skeleton */}
      <CardGridLoading count={6} />
    </div>
  );
}

/**
 * AuthLoading - Authentication loading state
 */
export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
        >
          <span className="text-3xl">💎</span>
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">Giriş Yapılıyor...</h2>
        <p className="text-muted-foreground">Lütfen bekleyin</p>

        <LoadingSpinner size="md" className="mt-6" />
      </motion.div>
    </div>
  );
}

/**
 * UploadLoading - File upload progress
 */
interface UploadLoadingProps {
  progress: number;
  fileName?: string;
}

export function UploadLoading({ progress, fileName }: UploadLoadingProps) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {fileName || 'Dosya yükleniyor...'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">%{progress}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
        />
      </div>
    </div>
  );
}

/**
 * FormSubmitLoading - Form submission loading
 */
export function FormSubmitLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-2xl bg-card border border-border/5 shadow-xl text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
        >
          <span className="text-2xl">✓</span>
        </motion.div>

        <h3 className="text-lg font-bold mb-2">Gönderiliyor...</h3>
        <p className="text-sm text-muted-foreground mb-4">
          İşleminiz tamamlanıyor, lütfen bekleyin
        </p>

        <LoadingSpinner size="md" />
      </motion.div>
    </div>
  );
}

/**
 * StatsLoading - Stats cards loading skeleton
 */
export function StatsLoading({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <StatsCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * ReviewListLoading - Reviews list loading skeleton
 */
export function ReviewListLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <ReviewSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMBO LOADING STATES (Skeleton + Spinner)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PageWithHeaderLoading - Page with header skeleton
 */
export function PageWithHeaderLoading() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/5">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <ContentLoading message="İçerik yükleniyor..." />
      </div>
    </div>
  );
}

/**
 * DashboardLoading - Dashboard page loading
 */
export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border/5" />

      <div className="container py-8 space-y-8">
        {/* Stats */}
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <StatsLoading count={4} />
        </div>

        {/* Charts/Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-card border border-border/5">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full rounded" />
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/5">
            <Skeleton className="h-6 w-32 mb-4" />
            <ListLoading count={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
