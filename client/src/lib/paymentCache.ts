export interface CachedAuthorization {
  from: string;
  to: string;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: string;
  v: number;
  r: string;
  s: string;
  used: boolean;
}

export interface PaymentCache {
  walletAddress: string;
  authorizations: CachedAuthorization[];
  createdAt: number;
}

const CACHE_KEY = 'x402_payment_cache';
const CACHE_EXPIRY_MS = 3600 * 1000; // 1 hour

export class PaymentCacheManager {
  static saveCache(cache: PaymentCache): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log('Payment cache saved:', cache.authorizations.length, 'authorizations');
    } catch (error) {
      console.error('Failed to save payment cache:', error);
    }
  }

  static getCache(walletAddress: string): PaymentCache | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        console.log('No payment cache found');
        return null;
      }

      const cache: PaymentCache = JSON.parse(cached);

      // Validate cache is for correct wallet
      if (cache.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        console.log('Cache is for different wallet, clearing');
        this.clearCache();
        return null;
      }

      // Check if cache is expired
      const age = Date.now() - cache.createdAt;
      if (age > CACHE_EXPIRY_MS) {
        console.log('Payment cache expired, clearing');
        this.clearCache();
        return null;
      }

      console.log('Payment cache loaded:', cache.authorizations.filter(a => !a.used).length, 'unused authorizations');
      return cache;
    } catch (error) {
      console.error('Failed to load payment cache:', error);
      return null;
    }
  }

  static getNextUnusedAuthorization(walletAddress: string): CachedAuthorization | null {
    const cache = this.getCache(walletAddress);
    if (!cache) {
      return null;
    }

    const unused = cache.authorizations.find(auth => !auth.used);
    return unused || null;
  }

  static markAuthorizationAsUsed(walletAddress: string, nonce: string): void {
    const cache = this.getCache(walletAddress);
    if (!cache) {
      return;
    }

    const auth = cache.authorizations.find(a => a.nonce === nonce);
    if (auth) {
      auth.used = true;
      this.saveCache(cache);
      console.log('Authorization marked as used, remaining:', cache.authorizations.filter(a => !a.used).length);
    }
  }

  static getRemainingCount(walletAddress: string): number {
    const cache = this.getCache(walletAddress);
    if (!cache) {
      return 0;
    }

    return cache.authorizations.filter(auth => !auth.used).length;
  }

  static clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      console.log('Payment cache cleared');
    } catch (error) {
      console.error('Failed to clear payment cache:', error);
    }
  }

  static addAuthorizations(walletAddress: string, authorizations: CachedAuthorization[]): void {
    const cache: PaymentCache = {
      walletAddress,
      authorizations: authorizations.map(auth => ({ ...auth, used: false })),
      createdAt: Date.now(),
    };

    this.saveCache(cache);
  }
}
