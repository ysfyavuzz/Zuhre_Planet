import React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

// ─────────────────────────────────────────────────────────────────────────────
// PRE-BUILT SKELETON VARIANTS FOR COMMON UI PATTERNS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CardSkeleton - Escort card loading state
 * Matches StandardCard aspect ratio and layout
 */
export function CardSkeleton() {
  return (
    <div className="w-full aspect-[3/4.2] rounded-2xl bg-card border border-border/5 overflow-hidden">
      {/* Image Section */}
      <Skeleton className="w-full aspect-[3/3.5]" />

      {/* Info Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 rounded" />

        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/5">
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
          <Skeleton className="h-10 w-full rounded" />
        </div>

        {/* Reliability Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * ProfileSkeleton - Profile page loading state
 */
export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="relative">
        {/* Cover Photo */}
        <Skeleton className="w-full h-48 md:h-64 rounded-t-2xl" />

        {/* Profile Photo & Info */}
        <div className="container px-4 -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row gap-4 items-end md:items-end">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background" />
            <div className="flex-1 space-y-2 pb-2">
              <Skeleton className="h-8 w-48 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid md:grid-cols-3 gap-6 container">
        {/* Left Column */}
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/**
 * ListSkeleton - List items loading state
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/5">
          <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  )
}

/**
 * TableSkeleton - Table loading state (for admin dashboard)
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/5">
      {/* Header */}
      <div className="flex bg-muted/50 border-b border-border/5">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 p-3">
            <Skeleton className="h-4 w-full rounded" />
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="flex-1 p-3">
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * GallerySkeleton - Image gallery loading state
 */
export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-square rounded-xl"
        />
      ))}
    </div>
  )
}

/**
 * TextBlockSkeleton - Paragraph/text loading state
 */
export function TextBlockSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

/**
 * AvatarSkeleton - User avatar loading state
 */
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  return <Skeleton className={cn("rounded-full shrink-0", sizeClasses[size])} />
}

/**
 * ButtonSkeleton - Button loading state
 */
export function ButtonSkeleton({ width = "w-24" }: { width?: string }) {
  return <Skeleton className={cn("h-10 rounded-full", width)} />
}

/**
 * ReviewSkeleton - Review card loading state
 */
export function ReviewSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AvatarSkeleton size="md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>
      <TextBlockSkeleton lines={2} />
    </div>
  )
}

/**
 * StatsCardSkeleton - Stats card loading state
 */
export function StatsCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-card border border-border/5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-20 rounded-lg mb-2" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}

/**
 * FormSkeleton - Form loading state
 */
export function FormSkeleton({ fieldCount = 4 }: { fieldCount?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fieldCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <ButtonSkeleton />
        <ButtonSkeleton />
      </div>
    </div>
  )
}

/**
 * MessageSkeleton - Chat message loading state
 */
export function MessageSkeleton() {
  return (
    <div className="flex gap-3 max-w-xs">
      <AvatarSkeleton size="sm" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-16 w-full rounded-xl rounded-tl-none" />
      </div>
    </div>
  )
}
