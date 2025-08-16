import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Parser from 'rss-parser';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Video, FeedConfig, FeedResponse } from '$lib/types';

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'media:group'],
      ['media:thumbnail', 'media:thumbnail'],
      ['yt:channelId', 'yt:channelId']
    ]
  }
});

function parseDate(dateString: string | undefined): Date {
  if (!dateString) {
    console.log('No date string provided, using current date');
    return new Date();
  }
  
  console.log('Parsing date string:', dateString);
  
  try {
    // Try parsing as ISO string first
    let parsed = new Date(dateString);
    
    // Check if the parsed date is valid
    if (!isNaN(parsed.getTime())) {
      console.log('Successfully parsed date:', parsed.toISOString());
      return parsed;
    }
    
    // Try parsing common RSS date formats
    const dateFormats = [
      // RFC 822 format (common in RSS)
      /^(\w{3}), (\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/,
      // RFC 850 format
      /^(\w+), (\d{1,2})-(\w{3})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/,
      // ANSI C format
      /^(\w{3}) (\w{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/
    ];
    
    for (const format of dateFormats) {
      const match = dateString.match(format);
      if (match) {
        console.log('Matched date format:', format.source);
        // For now, just use the original string parsing as fallback
        break;
      }
    }
    
    // Try a more aggressive parsing approach
    parsed = new Date(dateString.replace(/\s+GMT$/, ''));
    if (!isNaN(parsed.getTime())) {
      console.log('Successfully parsed date after GMT removal:', parsed.toISOString());
      return parsed;
    }
    
    console.warn('Failed to parse date string:', dateString);
    return new Date();
    
  } catch (error) {
    console.warn('Error parsing date:', dateString, error);
    return new Date();
  }
}

export const GET: RequestHandler = async () => {
  try {
    // Read the YAML config file from the project root
    const configPath = join(process.cwd(), 'subscriptions.yaml');
    const yamlText = readFileSync(configPath, 'utf8');
    const config: FeedConfig = yaml.load(yamlText) as FeedConfig;

    if (!config?.feeds || config.feeds.length === 0) {
      return json({ videos: [], error: 'No feeds configured' });
    }

    const allVideos: Video[] = [];
    const errors: string[] = [];

    // Fetch all feeds in parallel
    const feedPromises = config.feeds.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);
        const videos = feed.items.map((item) => {
          // Extract thumbnail from media:group or use default
          let thumbnail = 'https://via.placeholder.com/320x180/cccccc/666666?text=No+Thumbnail';
          
          if (item['media:group'] && item['media:group']['media:thumbnail']) {
            const mediaThumbnails = item['media:group']['media:thumbnail'];
            if (Array.isArray(mediaThumbnails) && mediaThumbnails.length > 0) {
              thumbnail = mediaThumbnails[0].$.url;
            } else if (typeof mediaThumbnails === 'object' && mediaThumbnails.$.url) {
              thumbnail = mediaThumbnails.$.url;
            }
          }

          // Use the safe date parsing function
          const publishDate = parseDate(item.pubDate);

          return {
            title: item.title || 'Untitled',
            link: item.link || '#',
            thumbnail,
            channel: feed.title || 'Unknown Channel',
            publishDate,
            description: item.contentSnippet || item.content
          };
        });
        
        allVideos.push(...videos);
      } catch (error) {
        console.error(`Failed to fetch feed ${feedUrl}:`, error);
        errors.push(`Failed to fetch ${feedUrl}`);
      }
    });

    await Promise.all(feedPromises);

    // Sort videos by publish date (newest first)
    allVideos.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

    return json({
      videos: allVideos,
      error: errors.length > 0 ? errors.join('; ') : undefined
    });

  } catch (error) {
    console.error('Server error:', error);
    return json(
      { videos: [], error: 'Internal server error' },
      { status: 500 }
    );
  }
};
