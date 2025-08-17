import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cacheService } from '$lib/cacheService';

export const GET: RequestHandler = async () => {
  try {
    const cacheInfo = cacheService.getCacheInfo();
    
    return json({
      success: true,
      cacheInfo,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('API: Error getting cache info:', error);
    return json({ 
      success: false, 
      error: 'Failed to get cache info' 
    }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async () => {
  try {
    cacheService.clear();
    
    return json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('API: Error clearing cache:', error);
    return json({ 
      success: false, 
      error: 'Failed to clear cache' 
    }, { status: 500 });
  }
};
