<script lang="ts">
  import type { Video } from '../types';

  export let video: Video;

  function formatDate(date: Date | string): string {
    try {
      console.log('VideoCard: formatDate called with:', date, typeof date);
      
      // Handle both Date objects and date strings
      let dateObj: Date;
      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else {
        dateObj = date;
      }
      
      // Check if the date is valid
      if (!dateObj || isNaN(dateObj.getTime())) {
        console.warn('VideoCard: Invalid date object:', dateObj);
        return 'Unknown date';
      }
      
      console.log('VideoCard: Valid date object:', dateObj.toISOString());
      
      const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj);
      
      console.log('VideoCard: Formatted date:', formatted);
      return formatted;
      
    } catch (error) {
      console.warn('VideoCard: Error formatting date:', error);
      return 'Unknown date';
    }
  }
</script>

<div class="video-card">
  <div class="thumbnail-container">
    <img 
      src={video.thumbnail} 
      alt={video.title}
      loading="lazy"
      class="thumbnail"
    />
  </div>
  
  <div class="video-info">
    <h3 class="video-title">
      <a href={video.link} target="_blank" rel="noopener noreferrer">
        {video.title}
      </a>
    </h3>
    
    <p class="channel-name">{video.channel}</p>
    
    <p class="publish-date">
      {formatDate(video.publishDate)}
    </p>
  </div>
</div>

<style>
  .video-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .thumbnail-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
  }

  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-info {
    padding: 16px;
  }

  .video-title {
    margin: 0 0 8px 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .video-title a {
    color: #1a1a1a;
    text-decoration: none;
  }

  .video-title a:hover {
    color: #2563eb;
  }

  .channel-name {
    margin: 0 0 4px 0;
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .publish-date {
    margin: 0;
    font-size: 0.75rem;
    color: #9ca3af;
  }
</style>
