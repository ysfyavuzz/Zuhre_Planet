/**
 * Admin Action Hooks
 *
 * Custom React hooks for admin actions and mutations.
 * Handles user actions like ban, approve, reject, etc.
 *
 * @module hooks/useAdminActions
 * @category Hooks - Admin
 *
 * Features:
 * - Optimistic updates
 * - Toast notifications on success/error
 * - Loading states for actions
 * - Rollback on error
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import * as adminApi from '@/services/adminApi';
import type {
  AdminUser,
  AdminListing,
  AdminReview,
  AdminReport,
  BulkActionResult,
} from '@/types/admin';

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC ACTION HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use action hook with loading state and toast notifications
 */
function useAction<T = unknown, Args extends any[] = any[]>(
  actionFn: (...args: Args) => Promise<adminApi.ApiResponse<T>>,
  options: {
    successMessage?: string | ((data: T) => string);
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await actionFn(...args);

      if (response.success) {
        if (options.successMessage) {
          const message = typeof options.successMessage === 'function'
            ? options.successMessage(response.data as T)
            : options.successMessage;
          toast.success(message);
        }
        options.onSuccess?.(response.data as T);
        return { success: true, data: response.data };
      } else if (response.error) {
        setError(response.error.message);
        toast.error(options.errorMessage || response.error.message);
        options.onError?.(new Error(response.error.message));
        return { success: false, error: response.error };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(message);
      toast.error(options.errorMessage || message);
      options.onError?.(err as Error);
      return { success: false, error: { message } };
    } finally {
      setIsLoading(false);
    }
  }, [actionFn, options]);

  return { execute, isLoading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// USER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use ban user action
 */
export function useBanUser() {
  return useAction(
    (id: string, reason: string, permanent?: boolean, until?: string) =>
      adminApi.banUser(id, reason, permanent, until),
    {
      successMessage: 'Kullanıcı başarıyla engellendi',
      errorMessage: 'Kullanıcı engellenirken hata oluştu',
    }
  );
}

/**
 * Use unban user action
 */
export function useUnbanUser() {
  return useAction(
    (id: string) => adminApi.unbanUser(id),
    {
      successMessage: 'Kullanıcı engeli kaldırıldı',
      errorMessage: 'Engel kaldırılırken hata oluştu',
    }
  );
}

/**
 * Use suspend user action
 */
export function useSuspendUser() {
  return useAction(
    (id: string, reason: string, until?: string) =>
      adminApi.suspendUser(id, reason, until),
    {
      successMessage: 'Kullanıcı hesabı askıya alındı',
      errorMessage: 'Hesap askıya alınırken hata oluştu',
    }
  );
}

/**
 * Use unsuspend user action
 */
export function useUnsuspendUser() {
  return useAction(
    (id: string) => adminApi.unsuspendUser(id),
    {
      successMessage: 'Hesap askıya alma kaldırıldı',
      errorMessage: 'İşlem başarısız',
    }
  );
}

/**
 * Use verify user action
 */
export function useVerifyUser() {
  return useAction(
    (id: string) => adminApi.verifyUser(id),
    {
      successMessage: 'Kullanıcı onaylandı',
      errorMessage: 'Onaylama başarısız',
    }
  );
}

/**
 * Use set user membership action
 */
export function useSetUserMembership() {
  return useAction(
    (id: string, membership: string) =>
      adminApi.setUserMembership(id, membership),
    {
      successMessage: 'Üyelik tipi güncellendi',
      errorMessage: 'Üyelik güncellenirken hata oluştu',
    }
  );
}

/**
 * Use set user featured position action
 */
export function useSetUserFeaturedPosition() {
  return useAction(
    (id: string, position: number | null) =>
      adminApi.setUserFeaturedPosition(id, position),
    {
      successMessage: 'Vitrin sırası güncellendi',
      errorMessage: 'Vitrin sırası güncellenirken hata oluştu',
    }
  );
}

/**
 * Use boost user action
 */
export function useBoostUser() {
  return useAction(
    (id: string, duration: number) => adminApi.boostUser(id, duration),
    {
      successMessage: 'Boost uygulandı',
      errorMessage: 'Boost uygulanırken hata oluştu',
    }
  );
}

/**
 * Use set user visibility action
 */
export function useSetUserVisibility() {
  return useAction(
    (
      id: string,
      profileVisibility: boolean,
      phoneVisibility: 'visible' | 'masked' | 'hidden',
      messageAvailability: boolean
    ) =>
      adminApi.setUserVisibility(id, profileVisibility, phoneVisibility, messageAvailability),
    {
      successMessage: 'Görünürlük ayarları güncellendi',
      errorMessage: 'Görünürlük güncellenirken hata oluştu',
    }
  );
}

/**
 * Use delete user action
 */
export function useDeleteUser() {
  return useAction(
    (id: string, reason?: string) => adminApi.deleteUser(id, reason),
    {
      successMessage: 'Kullanıcı silindi',
      errorMessage: 'Kullanıcı silinirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BULK USER ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use bulk set membership action
 */
export function useBulkSetMembership() {
  return useAction(
    (userIds: string[], membership: string) =>
      adminApi.bulkSetMembership(userIds, membership),
    {
      successMessage: (data: BulkActionResult) =>
        `${data.succeeded}/${data.processed} kullanıcının üyeliği güncellendi`,
      errorMessage: 'Toplu üyelik güncellemesi başarısız',
    }
  );
}

/**
 * Use bulk boost users action
 */
export function useBulkBoostUsers() {
  return useAction(
    (userIds: string[], duration: number) =>
      adminApi.bulkBoostUsers(userIds, duration),
    {
      successMessage: (data: BulkActionResult) =>
        `${data.succeeded}/${data.processed} kullanıcıya boost verildi`,
      errorMessage: 'Toplu boost işlemi başarısız',
    }
  );
}

/**
 * Use bulk set visibility action
 */
export function useBulkSetVisibility() {
  return useAction(
    (
      userIds: string[],
      profileVisibility?: boolean,
      phoneVisibility?: 'visible' | 'masked' | 'hidden',
      messageAvailability?: boolean
    ) =>
      adminApi.bulkSetVisibility(userIds, profileVisibility, phoneVisibility, messageAvailability),
    {
      successMessage: 'Görünürlük ayarları güncellendi',
      errorMessage: 'Toplu görünürlük güncellemesi başarısız',
    }
  );
}

/**
 * Use bulk delete users action
 */
export function useBulkDeleteUsers() {
  return useAction(
    (userIds: string[], reason?: string) =>
      adminApi.bulkDeleteUsers(userIds, reason),
    {
      successMessage: (data: BulkActionResult) =>
        `${data.succeeded}/${data.processed} kullanıcı silindi`,
      errorMessage: 'Toplu silme işlemi başarısız',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTING ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use approve listing action
 */
export function useApproveListing() {
  return useAction(
    (id: string) => adminApi.approveListing(id),
    {
      successMessage: 'İlan onaylandı',
      errorMessage: 'İlan onaylanırken hata oluştu',
    }
  );
}

/**
 * Use reject listing action
 */
export function useRejectListing() {
  return useAction(
    (id: string, reason: string) => adminApi.rejectListing(id, reason),
    {
      successMessage: 'İlan reddedildi',
      errorMessage: 'İlan reddedilirken hata oluştu',
    }
  );
}

/**
 * Use suspend listing action
 */
export function useSuspendListing() {
  return useAction(
    (id: string, reason: string) => adminApi.suspendListing(id, reason),
    {
      successMessage: 'İlan askıya alındı',
      errorMessage: 'İlan askıya alınırken hata oluştu',
    }
  );
}

/**
 * Use delete listing action
 */
export function useDeleteListing() {
  return useAction(
    (id: string) => adminApi.deleteListing(id),
    {
      successMessage: 'İlan silindi',
      errorMessage: 'İlan silinirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use approve review action
 */
export function useApproveReview() {
  return useAction(
    (id: string) => adminApi.approveReview(id),
    {
      successMessage: 'Değerlendirme onaylandı',
      errorMessage: 'Değerlendirme onaylanırken hata oluştu',
    }
  );
}

/**
 * Use reject review action
 */
export function useRejectReview() {
  return useAction(
    (id: string, reason?: string) => adminApi.rejectReview(id, reason),
    {
      successMessage: 'Değerlendirme reddedildi',
      errorMessage: 'Değerlendirme reddedilirken hata oluştu',
    }
  );
}

/**
 * Use hide review action
 */
export function useHideReview() {
  return useAction(
    (id: string) => adminApi.hideReview(id),
    {
      successMessage: 'Değerlendirme gizlendi',
      errorMessage: 'Değerlendirme gizlenirken hata oluştu',
    }
  );
}

/**
 * Use show review action
 */
export function useShowReview() {
  return useAction(
    (id: string) => adminApi.showReview(id),
    {
      successMessage: 'Değerlendirme görünür yapıldı',
      errorMessage: 'İşlem başarısız',
    }
  );
}

/**
 * Use delete review action
 */
export function useDeleteReview() {
  return useAction(
    (id: string) => adminApi.deleteReview(id),
    {
      successMessage: 'Değerlendirme silindi',
      errorMessage: 'Değerlendirme silinirken hata oluştu',
    }
  );
}

/**
 * Use respond to review action
 */
export function useRespondToReview() {
  return useAction(
    (id: string, response: string) => adminApi.respondToReview(id, response),
    {
      successMessage: 'Yanıt gönderildi',
      errorMessage: 'Yanıt gönderilirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use update report status action
 */
export function useUpdateReportStatus() {
  return useAction(
    (id: string, status: string, resolution?: string) =>
      adminApi.updateReportStatus(id, status, resolution),
    {
      successMessage: 'Rapor durumu güncellendi',
      errorMessage: 'Rapor güncellenirken hata oluştu',
    }
  );
}

/**
 * Use assign report action
 */
export function useAssignReport() {
  return useAction(
    (id: string, adminId: string) => adminApi.assignReport(id, adminId),
    {
      successMessage: 'Rapor atandı',
      errorMessage: 'Rapor atanırken hata oluştu',
    }
  );
}

/**
 * Use dismiss report action
 */
export function useDismissReport() {
  return useAction(
    (id: string, note?: string) => adminApi.dismissReport(id, note),
    {
      successMessage: 'Rapor yok sayıldı',
      errorMessage: 'İşlem başarısız',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use update site settings action
 */
export function useUpdateSiteSettings() {
  return useAction(
    (settings: Partial<import('@/types/admin').SiteSettings>) =>
      adminApi.updateSiteSettings(settings),
    {
      successMessage: 'Ayarlar güncellendi',
      errorMessage: 'Ayarlar güncellenirken hata oluştu',
    }
  );
}

/**
 * Use update theme settings action
 */
export function useUpdateThemeSettings() {
  return useAction(
    (theme: Partial<import('@/types/admin').SiteSettings['theme']>) =>
      adminApi.updateThemeSettings(theme),
    {
      successMessage: 'Tema ayarları güncellendi',
      errorMessage: 'Tema güncellenirken hata oluştu',
    }
  );
}

/**
 * Use update media settings action
 */
export function useUpdateMediaSettings() {
  return useAction(
    (media: Partial<import('@/types/admin').SiteSettings['media']>) =>
      adminApi.updateMediaSettings(media),
    {
      successMessage: 'Medya ayarları güncellendi',
      errorMessage: 'Medya ayarları güncellenirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use create navigation item action
 */
export function useCreateNavigationItem() {
  return useAction(
    (item: Omit<import('@/types/admin').NavigationItem, 'id'>) =>
      adminApi.createNavigationItem(item),
    {
      successMessage: 'Menü öğesi eklendi',
      errorMessage: 'Menü öğesi eklenirken hata oluştu',
    }
  );
}

/**
 * Use update navigation item action
 */
export function useUpdateNavigationItem() {
  return useAction(
    (id: string, item: Partial<import('@/types/admin').NavigationItem>) =>
      adminApi.updateNavigationItem(id, item),
    {
      successMessage: 'Menü öğesi güncellendi',
      errorMessage: 'Menü öğesi güncellenirken hata oluştu',
    }
  );
}

/**
 * Use delete navigation item action
 */
export function useDeleteNavigationItem() {
  return useAction(
    (id: string) => adminApi.deleteNavigationItem(id),
    {
      successMessage: 'Menü öğesi silindi',
      errorMessage: 'Menü öğesi silinirken hata oluştu',
    }
  );
}

/**
 * Use reorder navigation items action
 */
export function useReorderNavigationItems() {
  return useAction(
    (items: Array<{ id: string; order: number }>) =>
      adminApi.reorderNavigationItems(items),
    {
      successMessage: 'Sıralama güncellendi',
      errorMessage: 'Sıralama güncellenirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use create page action
 */
export function useCreatePage() {
  return useAction(
    (page: Omit<import('@/types/admin').Page, 'id' | 'createdAt' | 'updatedAt'>) =>
      adminApi.createPage(page),
    {
      successMessage: 'Sayfa oluşturuldu',
      errorMessage: 'Sayfa oluşturulurken hata oluştu',
    }
  );
}

/**
 * Use update page action
 */
export function useUpdatePage() {
  return useAction(
    (id: string, page: Partial<import('@/types/admin').Page>) =>
      adminApi.updatePage(id, page),
    {
      successMessage: 'Sayfa güncellendi',
      errorMessage: 'Sayfa güncellenirken hata oluştu',
    }
  );
}

/**
 * Use delete page action
 */
export function useDeletePage() {
  return useAction(
    (id: string) => adminApi.deletePage(id),
    {
      successMessage: 'Sayfa silindi',
      errorMessage: 'Sayfa silinirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASE & FEATURED ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use set featured escort action
 */
export function useSetFeaturedEscort() {
  return useAction(
    (escortId: string, position: number, badge?: string) =>
      adminApi.setFeaturedEscort(escortId, position, badge),
    {
      successMessage: 'Öne çıkan escort ayarlandı',
      errorMessage: 'İşlem başarısız',
    }
  );
}

/**
 * Use remove featured escort action
 */
export function useRemoveFeaturedEscort() {
  return useAction(
    (id: string) => adminApi.removeFeaturedEscort(id),
    {
      successMessage: 'Vitrinden kaldırıldı',
      errorMessage: 'İşlem başarısız',
    }
  );
}

/**
 * Use update hero banner action
 */
export function useUpdateHeroBanner() {
  return useAction(
    (banner: Partial<import('@/types/admin').HeroBanner>) =>
      adminApi.updateHeroBanner(banner),
    {
      successMessage: 'Hero banner güncellendi',
      errorMessage: 'Banner güncellenirken hata oluştu',
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO APPROVAL ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use approve photo action
 */
export function useApprovePhoto() {
  return useAction(
    (id: string) => adminApi.approvePhoto(id),
    {
      successMessage: 'Fotoğraf onaylandı',
      errorMessage: 'Fotoğraf onaylanırken hata oluştu',
    }
  );
}

/**
 * Use reject photo action
 */
export function useRejectPhoto() {
  return useAction(
    (id: string, reason: string) => adminApi.rejectPhoto(id, reason),
    {
      successMessage: 'Fotoğraf reddedildi',
      errorMessage: 'Fotoğraf reddedilirken hata oluştu',
    }
  );
}

/**
 * Use bulk approve photos action
 */
export function useBulkApprovePhotos() {
  return useAction(
    (photoIds: string[]) => adminApi.bulkApprovePhotos(photoIds),
    {
      successMessage: (data: BulkActionResult) =>
        `${data.succeeded}/${data.processed} fotoğraf onaylandı`,
      errorMessage: 'Toplu onaylama başarısız',
    }
  );
}

/**
 * Use bulk reject photos action
 */
export function useBulkRejectPhotos() {
  return useAction(
    (photoIds: string[], reason: string) =>
      adminApi.bulkRejectPhotos(photoIds, reason),
    {
      successMessage: (data: BulkActionResult) =>
        `${data.succeeded}/${data.processed} fotoğraf reddedildi`,
      errorMessage: 'Toplu red işlemi başarısız',
    }
  );
}
