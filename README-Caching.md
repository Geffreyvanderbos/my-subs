# RSS Caching System

## Overview

The RSS caching system has been implemented to reduce the number of RSS requests made to YouTube, improving performance and reducing load on external services.

## How It Works

### Cache Behavior
- **Default TTL**: 15 minutes (configurable in `src/lib/cacheService.ts`)
- **Automatic Cleanup**: Expired entries are automatically removed every 5 minutes
- **In-Memory Storage**: Cache is stored in memory and persists during the application session

### API Endpoints

#### GET `/api/feeds`
- **Cached Response**: Returns cached data if available and fresh
- **Fresh Fetch**: Fetches new RSS data if cache is expired or missing
- **Response Format**: 
  ```json
  {
    "videos": [...],
    "cached": true/false,
    "cacheTimestamp": 1234567890
  }
  ```

#### POST `/api/feeds/refresh`
- **Purpose**: Force refresh of RSS feeds, bypassing cache
- **Behavior**: Fetches fresh data and updates cache
- **Use Case**: Manual refresh when user wants latest content

#### GET `/api/feeds/cache`
- **Purpose**: Get cache statistics and information
- **Response**: Cache size, keys, and statistics

#### DELETE `/api/feeds/cache`
- **Purpose**: Clear all cached data
- **Use Case**: Force fresh data on next request

## Frontend Integration

### Cache Status Display
- Shows when data is from cache
- Displays cache timestamp
- Shows time until cache expires
- Visual indicator (📦) for cached data

### Refresh Button
- Uses the refresh endpoint to bypass cache
- Updates UI with fresh data
- Maintains user experience during refresh

## Configuration

### Cache TTL
Modify the `defaultTTL` in `src/lib/cacheService.ts`:
```typescript
private defaultTTL = 15 * 60 * 1000; // 15 minutes in milliseconds
```

### Cleanup Interval
Modify the cleanup interval in the constructor:
```typescript
this.cleanupInterval = setInterval(() => {
  this.cleanup();
}, 5 * 60 * 1000); // 5 minutes
```

## Benefits

1. **Reduced RSS Requests**: Significantly fewer requests to YouTube RSS feeds
2. **Faster Response Times**: Cached data returns instantly
3. **Better User Experience**: Faster page loads and smoother interactions
4. **Reduced External Load**: Less strain on YouTube's RSS services
5. **Configurable TTL**: Adjust cache duration based on needs

## Monitoring

The system provides logging for:
- Cache hits and misses
- RSS fetch operations
- Cache cleanup operations
- Error conditions

Check the browser console and server logs for detailed information about cache behavior.

## Future Enhancements

Potential improvements could include:
- Persistent cache storage (Redis, database)
- Cache warming strategies
- Adaptive TTL based on channel update frequency
- Cache invalidation webhooks
- Cache performance metrics
