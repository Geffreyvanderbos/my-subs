import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cacheService } from '$lib/cacheService';
import { rssService } from '$lib/rssService';

const CACHE_KEY = 'rss_feeds';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const GET: RequestHandler = async () => {
  try {
    console.log('API: Starting feed fetch request');
    
    // Check if we have fresh cached data
    const cachedVideos = cacheService.get(CACHE_KEY);
    if (cachedVideos) {
      console.log('API: Returning cached data,', cachedVideos.length, 'videos');
      return json({ 
        videos: cachedVideos, 
        cached: true,
        cacheTimestamp: Date.now()
      });
    }

    // No cache or expired, fetch fresh data
    console.log('API: No fresh cache, fetching RSS feeds...');
    const videos = await rssService.fetchFeeds();
    
    // Cache the results
    cacheService.set(CACHE_KEY, videos, CACHE_TTL);
    console.log('API: Cached fresh RSS data');
    
    return json({ 
      videos, 
      cached: false,
      cacheTimestamp: Date.now()
    });

  } catch (error) {
    console.error('API: Unexpected error:', error);
    return json({ videos: [], error: 'Failed to fetch feeds' });
  }
};
