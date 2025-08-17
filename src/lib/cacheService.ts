import type { Video } from './types';

interface CacheEntry {
  data: Video[];
  timestamp: number;
  ttl: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 15 * 60 * 1000; // 15 minutes in milliseconds
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Set up automatic cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // 5 minutes
  }

  set(key: string, data: Video[], ttl?: number): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    this.cache.set(key, entry);
  }

  get(key: string): Video[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheInfo(): { size: number; keys: string[]; stats: CacheStats } {
    const now = Date.now();
    let totalSize = 0;
    let expiredCount = 0;
    let validCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      } else {
        validCount++;
        totalSize += entry.data.length;
      }
    }

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      stats: {
        totalEntries: this.cache.size,
        validEntries: validCount,
        expiredEntries: expiredCount,
        totalVideos: totalSize,
        defaultTTL: this.defaultTTL
      }
    };
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`CacheService: Cleaned up ${cleanedCount} expired entries`);
    }
  }

  // Cleanup on destruction
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

interface CacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  totalVideos: number;
  defaultTTL: number;
}

// Export a singleton instance
export const cacheService = new CacheService();
