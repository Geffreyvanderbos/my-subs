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
      
      return data;
    } catch (error) {
      console.error('FeedService: Failed to fetch feeds:', error);
      throw new Error('Failed to load videos');
    }
  }

  async refreshFeeds(): Promise<FeedResponse> {
    return this.fetchFeeds();
  }
}
