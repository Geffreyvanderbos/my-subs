import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cacheService } from '$lib/cacheService';
import { rssService } from '$lib/rssService';

const CACHE_KEY = 'rss_feeds';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const POST: RequestHandler = async () => {
  try {
    console.log('API: Refresh endpoint called - fetching fresh RSS data');
    
    // Fetch fresh RSS data
    const videos = await rssService.fetchFeeds();
    
    // Update the cache with fresh data
    cacheService.set(CACHE_KEY, videos, CACHE_TTL);
    console.log('API: Cache updated with fresh RSS data,', videos.length, 'videos');
    
    return json({ 
      success: true, 
      message: 'Feeds refreshed successfully',
      videos: videos,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('API: Error in refresh endpoint:', error);
    return json({ 
      success: false, 
      error: 'Failed to refresh feeds' 
    }, { status: 500 });
  }
};
