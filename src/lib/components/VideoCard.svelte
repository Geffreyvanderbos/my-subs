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

<a 
  href={video.link} 
  target="_blank" 
  rel="noopener noreferrer"
  class="video-card-link"
  aria-label="Watch {video.title} on YouTube"
>
  <div class="video-card">
    <div class="thumbnail-container">
      <img 
        src={video.thumbnail} 
        alt={video.title}
        loading="lazy"
        class="thumbnail"
      />
      <div class="thumbnail-overlay">
        <div class="play-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="video-info">
      <h3 class="video-title">
        {video.title}
      </h3>
      
      <div class="video-meta">
        <p class="channel-name">
          <svg class="channel-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {video.channel}
        </p>
        
        <p class="publish-date">
          <svg class="date-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          {formatDate(video.publishDate)}
        </p>
      </div>
    </div>
  </div>
</a>

<style>
  .video-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    position: relative;
    overflow: hidden;
  }

  .video-card {
    overflow: hidden;
    transition: all 0.164s var(--card-easing);
    position: relative;
  }

  .thumbnail-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    overflow: hidden;
  }

  .thumbnail {
    border-radius: 30px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.164s var(--card-easing);
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .thumbnail-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    opacity: 0;
    transition: opacity 0.164s var(--card-easing);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-card-link:hover .thumbnail-overlay {
    opacity: 1;
  }

  .play-button {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bg-primary);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    transform: scale(0.8);
    transition: transform 0.164s var(--card-easing);
  }

  .video-card-link:hover .play-button {
    transform: scale(1);
  }

  .play-button svg {
    width: 24px;
    height: 24px;
    margin-left: 2px;
  }

  .video-info {
    padding: 1.5rem;
  }

  .video-title {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--text-primary);
  }

  .video-meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .channel-name,
  .publish-date {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .channel-name {
    font-weight: 500;
    color: var(--text-secondary);
    justify-content: flex-start;
  }

  .publish-date {
    color: var(--text-muted);
    font-size: 0.8rem;
    justify-content: flex-end;
  }

  .channel-icon,
  .date-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .video-card-link {
      border-radius: 16px;
    }

    .video-info {
      padding: 1.25rem;
    }

    .video-title {
      font-size: 1rem;
    }

    .play-button {
      width: 50px;
      height: 50px;
    }

    .play-button svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    .video-card-link:hover {
      transform: translateY(-4px) scale(1.01);
    }

    .video-info {
      padding: 1rem;
    }

    .video-meta {
      gap: 0.5rem;
    }
  }
</style>
