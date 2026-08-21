type CacheValue = {
  value: any;
  lastModified: number;
  tags?: string[];
};

class CacheHandler {
  private cache: Map<string, CacheValue>;

  constructor() {
    this.cache = new Map();
  }

  async get(key: string) {
    return this.cache.get(key)?.value;
  }

  async set(key: string, data: any, ctx?: { tags?: string[] }) {
    this.cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx?.tags || [],
    });
  }

  async revalidateTag(tags: string | string[]) {
    tags = Array.isArray(tags) ? tags : [tags];
    for (const [key, value] of this.cache) {
      if (value.tags && value.tags.some((tag) => tags.includes(tag))) {
        this.cache.delete(key);
      }
    }
  }

  // Optional per-request short-lived cache reset hook
  resetRequestCache() {
    // no-op for in-memory implementation
  }
}

const cacheHandler = new CacheHandler();
export default cacheHandler;
