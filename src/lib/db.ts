import { db } from '../drizzle/db';
import * as schema from '../drizzle/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * Veritabanı yardımcı fonksiyonları (PostgreSQL uyumlu)
 */

export { db };
export const { users, escortProfiles, escortPhotos, customerProfiles } = schema;

export async function getAllApprovedEscorts(limit: number = 50, offset: number = 0) {
  return await db
    .select()
    .from(escortProfiles)
    .where(eq(escortProfiles.isVerifiedByAdmin, true))
    .limit(limit)
    .offset(offset);
}

export async function searchEscortsAdvanced(params: any) {
  return await db.select().from(escortProfiles).limit(20);
}

export async function getEscortProfileById(id: number) {
  const result = await db.select().from(escortProfiles).where(eq(escortProfiles.id, id)).limit(1);
  return result[0] || null;
}

export async function getEscortPhotos(profileId: number) {
  return await db.select().from(escortPhotos).where(eq(escortPhotos.profileId, profileId));
}

export async function getCities() {
  const result = await db.selectDistinct({ city: escortProfiles.city }).from(escortProfiles);
  return result.map(r => r.city);
}

export async function getDashboardStats() {
  const usersCount = await db.select({ count: sql<number>`count(*)` }).from(users);
  const escortsCount = await db.select({ count: sql<number>`count(*)` }).from(escortProfiles);
  return {
    totalUsers: Number(usersCount[0]?.count || 0),
    totalEscorts: Number(escortsCount[0]?.count || 0),
    pendingApprovalsCount: 0
  };
}

export async function getAllUsers(limit: number = 50, offset: number = 0) {
  return await db.select().from(users).limit(limit).offset(offset);
}

export async function updateEscortStatus(profileId: number, status: string) {
  const isVerified = status === 'approved';
  return await db.update(escortProfiles).set({ isVerifiedByAdmin: isVerified }).where(eq(escortProfiles.id, profileId));
}

export async function getEscortProfileByUserId(userId: number) {
  const result = await db.select().from(escortProfiles).where(eq(escortProfiles.userId, userId)).limit(1);
  return result[0] || null;
}

export async function getUserById(userId: number) {
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0] || null;
}

export async function getPendingEscorts() {
  return await db.select().from(escortProfiles).where(eq(escortProfiles.isVerifiedByAdmin, false));
}

// Mock/Helper functions
export async function incrementViewCount(id: number) { return { success: true }; }
export async function getUserFavorites(u: any, l: any, o: any) { return []; }
export async function addFavorite(u: any, e: any) { return { success: true }; }
export async function removeFavorite(u: any, e: any) { return { success: true }; }
export async function isFavorite(u: any, e: any) { return false; }
export async function updateEscortVerifiedBadge(id: number, v: boolean) { return { success: true }; }
export async function activateVip(id: number, p: string) { return { success: true }; }
export async function deactivateVip(id: number) { return { success: true }; }
export async function getPendingReviews() { return []; }
export async function updateReviewVerification(id: number, v: boolean) { return { success: true }; }
export async function deleteReview(id: number) { return { success: true }; }
export async function updateReview(id: number, d: any) { return { success: true }; }
export async function blockUser(id: number) { return { success: true }; }
export async function unblockUser(id: number) { return { success: true }; }
export async function deleteUser(id: number) { return { success: true }; }
export async function getAllEscorts(l: any, o: any) { return []; }
export async function getAllEscortsByStatus(s: string) { return []; }
export async function updateEscortProfile(id: number, d: any) { return { success: true }; }
export async function deleteEscort(id: number) { return { success: true }; }
export async function updateEscortVisibility(id: number, v: boolean) { return { success: true }; }
export async function getAllReviews(l: any, o: any) { return []; }
export async function createAppointment(d: any) { return { success: true }; }
export async function getUserAppointments(id: number) { return []; }
export async function getEscortAppointments(id: number) { return []; }
export async function createEscortProfile(d: any) { return { success: true }; }
export async function addEscortPhoto(d: any) { return { success: true }; }
export async function updateLastActive(id: number) { return { success: true }; }
export async function getVipEscorts(l: number) { return []; }
export async function getUserBalance(userId: number) { return 0; }
export async function updateUserBalance(userId: number, balance: number) { return { success: true }; }
export async function createCreditTransaction(data: any) { return { success: true }; }
export async function getUserCredits(userId: number) { return 0; }
export async function getAppointmentsByUserId(userId: number) { return []; }

export { schema };
