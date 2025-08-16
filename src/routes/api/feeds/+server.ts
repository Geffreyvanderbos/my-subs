import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Parser from 'rss-parser';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

const parser = new Parser();

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

    // Try parsing common RSS date formats (commented out as direct parsing often works for ISO)
    // const dateFormats = [
    //   /^(\w{3}), (\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/,
    //   /^(\w+), (\d{1,2})-(\w{3})-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/,
    //   /^(\w{3}) (\w{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/
    // ];
    // for (const format of dateFormats) {
    //   const match = dateString.match(format);
    //   if (match) {
    //     console.log('Matched date format:', format.source);
    //     break;
    //   }
    // }

    // Try a more aggressive parsing approach (e.g., removing "GMT")
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
    console.log('API: Starting feed fetch request');

    // Read the subscriptions.yaml file
    const yamlPath = path.join(process.cwd(), 'subscriptions.yaml');
    console.log('API: Reading YAML file from:', yamlPath);

    if (!fs.existsSync(yamlPath)) {
      console.error('API: subscriptions.yaml file not found');
      return json({ videos: [], error: 'Subscriptions file not found' });
    }

    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    const config = yaml.load(yamlContent) as { feeds: string[] };

    if (!config || !config.feeds || !Array.isArray(config.feeds)) {
      console.error('API: Invalid YAML structure');
      return json({ videos: [], error: 'Invalid subscriptions format' });
    }

    console.log('API: Found', config.feeds.length, 'channel IDs in YAML');

    const allVideos: any[] = [];

    // Process each channel ID
    for (const channelId of config.feeds) {
      try {
        // Clean the channel ID (remove any extra whitespace or URLs)
        const cleanChannelId = channelId.trim();
        
        // Construct the full YouTube RSS URL
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${cleanChannelId}`;
        
        console.log('API: Fetching RSS for channel ID:', cleanChannelId);
        console.log('API: Constructed RSS URL:', rssUrl);

        const response = await fetch(rssUrl);
        
        if (!response.ok) {
          console.warn(`API: Failed to fetch RSS for ${cleanChannelId}:`, response.status);
          continue;
        }

        const xmlText = await response.text();
        const feed = await parser.parseString(xmlText);

        console.log(`API: Successfully parsed RSS for ${cleanChannelId}, found ${feed.items?.length || 0} items`);

        if (feed.items) {
          const channelVideos = feed.items.map(item => {
            // Extract thumbnail from various possible locations in YouTube RSS
            let thumbnail = '';
            
            // Try different thumbnail sources in order of preference
            if (item['media:group'] && item['media:group']['media:thumbnail']) {
              const mediaThumbnails = item['media:group']['media:thumbnail'];
              if (Array.isArray(mediaThumbnails) && mediaThumbnails.length > 0) {
                thumbnail = mediaThumbnails[0].$.url;
              } else if (typeof mediaThumbnails === 'object' && mediaThumbnails.$.url) {
                thumbnail = mediaThumbnails.$.url;
              }
            }
            
            // Fallback to other thumbnail sources
            if (!thumbnail && item['media:thumbnail'] && item['media:thumbnail'][0]) {
              thumbnail = item['media:thumbnail'][0].$.url;
            }
            
            // If still no thumbnail, try to construct one from video ID
            if (!thumbnail && item.link) {
              // Extract video ID from various YouTube URL formats
              let videoId = null;
              
              // Try standard video format: ?v=VIDEO_ID
              const videoMatch = item.link.match(/[?&]v=([^&]+)/);
              if (videoMatch) {
                videoId = videoMatch[1];
              }
              
              // Try Shorts format: /shorts/VIDEO_ID
              if (!videoId) {
                const shortsMatch = item.link.match(/\/shorts\/([^/?&]+)/);
                if (shortsMatch) {
                  videoId = shortsMatch[1];
                }
              }
              
              // Try embed format: /embed/VIDEO_ID
              if (!videoId) {
                const embedMatch = item.link.match(/\/embed\/([^/?&]+)/);
                if (embedMatch) {
                  videoId = embedMatch[1];
                }
              }
              
              // Try watch format: /watch?v=VIDEO_ID
              if (!videoId) {
                const watchMatch = item.link.match(/\/watch\?v=([^&]+)/);
                if (watchMatch) {
                  videoId = watchMatch[1];
                }
              }
              
              if (videoId) {
                // Try multiple thumbnail qualities in order of preference
                const thumbnailUrls = [
                  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                  `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
                ];
                
                // Use the first available thumbnail (we'll validate them later if needed)
                thumbnail = thumbnailUrls[0];
              }
            }
            
            // Final fallback to a placeholder
            if (!thumbnail) {
              console.log(`API: No thumbnail found for "${item.title}". RSS structure:`, {
                link: item.link,
                mediaGroup: item['media:group'],
                mediaThumbnail: item['media:thumbnail'],
                hasContent: !!item.content,
                hasContentSnippet: !!item.contentSnippet
              });
              thumbnail = 'https://via.placeholder.com/320x180/cccccc/666666?text=No+Thumbnail';
            }
            
            console.log(`API: Video "${item.title}" - Thumbnail: ${thumbnail}`);
            
            return {
              title: item.title || 'Untitled',
              link: item.link || '',
              thumbnail: thumbnail,
              channel: feed.title || cleanChannelId,
              publishDate: parseDate(item.pubDate),
              description: item.contentSnippet || item.content || ''
            };
          });

          allVideos.push(...channelVideos);
        }

      } catch (error) {
        console.error(`API: Error processing channel ${channelId}:`, error);
        continue; // Continue with other channels even if one fails
      }
    }

    // Sort all videos by publish date (newest first)
    allVideos.sort((a, b) => {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      return dateB.getTime() - dateA.getTime();
    });

    console.log('API: Total videos found:', allVideos.length);
    console.log('API: Returning sorted videos');

    return json({ videos: allVideos });

  } catch (error) {
    console.error('API: Unexpected error:', error);
    return json({ videos: [], error: 'Failed to fetch feeds' });
  }
};
