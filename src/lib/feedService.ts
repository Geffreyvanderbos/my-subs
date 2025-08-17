import type { Video, FeedConfig, FeedResponse } from './types';

export class FeedService {
  async fetchFeeds(): Promise<FeedResponse> {
    try {
      console.log('FeedService: Starting fetch request to /api/feeds');
      
      const response = await fetch('/api/feeds');
      console.log('FeedService: Response received:', response);
      console.log('FeedService: Response status:', response.status);
      console.log('FeedService: Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('FeedService: Parsed response data:', data);
      console.log('FeedService: Videos count:', data.videos?.length || 0);
      console.log('FeedService: Data from cache:', data.cached || false);
      
      return data;
    } catch (error) {
      console.error('FeedService: Failed to fetch feeds:', error);
      throw new Error('Failed to load videos');
    }
  }

  async refreshFeeds(): Promise<FeedResponse> {
    try {
      console.log('FeedService: Starting refresh request to /api/feeds/refresh');
      
      const response = await fetch('/api/feeds/refresh', {
        method: 'POST'
      });
      console.log('FeedService: Refresh response received:', response);
      console.log('FeedService: Refresh response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('FeedService: Parsed refresh response data:', data);
      console.log('FeedService: Refresh success:', data.success);
      
      if (data.success) {
        return {
          videos: data.videos,
          cached: false,
          cacheTimestamp: data.timestamp
        };
      } else {
        throw new Error(data.error || 'Refresh failed');
      }
    } catch (error) {
      console.error('FeedService: Failed to refresh feeds:', error);
      throw new Error('Failed to refresh videos');
    }
  }
}
