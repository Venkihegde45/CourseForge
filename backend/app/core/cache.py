import time

class SimpleCache:
    def __init__(self, expire_seconds=3600):
        self.cache = {}
        self.expire_seconds = expire_seconds

    def get(self, key):
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.expire_seconds:
                return data
            else:
                del self.cache[key]
        return None

    def set(self, key, value):
        self.cache[key] = (value, time.time())

# Global cache instances
knowledge_map_cache = SimpleCache(expire_seconds=1800) # 30 mins
podcast_cache = SimpleCache(expire_seconds=3600)      # 1 hour
