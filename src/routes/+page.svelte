<script lang="ts">
  import { onMount } from 'svelte';
  import { FeedService } from '$lib/feedService';
  import VideoCard from '$lib/components/VideoCard.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import type { Video } from '$lib/types';

  let videos: Video[] = [];
  let loading = true;
  let error: string | null = null;
  let refreshing = false;

  const feedService = new FeedService();

  async function loadVideos() {
    try {
      loading = true;
      error = null;
      console.log('Loading videos...');
      
      const response = await feedService.fetchFeeds();
      console.log('API response:', response);
      
      videos = response.videos;
      if (response.error) {
        error = response.error;
      }
      
      console.log('Videos loaded:', videos.length);
    } catch (err) {
      console.error('Error loading videos:', err);
      error = err instanceof Error ? err.message : 'Failed to load videos';
    } finally {
      loading = false;
    }
  }

  async function refreshFeeds() {
    try {
      refreshing = true;
      error = null;
      console.log('Refreshing feeds...');
      
      const response = await feedService.refreshFeeds();
      console.log('Refresh response:', response);
      
      videos = response.videos;
      if (response.error) {
        error = response.error;
      }
      
      console.log('Videos refreshed:', videos.length);
    } catch (err) {
      console.error('Error refreshing videos:', err);
      error = err instanceof Error ? err.message : 'Failed to refresh videos';
    } finally {
      refreshing = false;
    }
  }

  onMount(() => {
    console.log('Component mounted, loading videos...');
    loadVideos();
  });
</script>

<svelte:head>
  <title>My YouTube - RSS Feed Reader</title>
</svelte:head>

<main>
  <header class="header">
    <div class="header-content">
      <h1>My YouTube</h1>
      <p class="subtitle">RSS Feed Reader</p>
      
      <button 
        class="refresh-button" 
        on:click={refreshFeeds}
        disabled={refreshing}
      >
        <span class="button-content">
          {#if refreshing}
            <div class="spinner"></div>
            <span>Refreshing...</span>
          {:else}
            <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            <span>Refresh Feeds</span>
          {/if}
        </span>
      </button>
    </div>
  </header>

  {#if error}
    <div class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h3>Error</h3>
        <p>{error}</p>
        <button class="retry-button" on:click={loadVideos}>Retry</button>
      </div>
    </div>
  {/if}

  {#if loading}
    <LoadingSpinner />
  {:else if videos.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📺</div>
      <h3>No Videos Found</h3>
      <p>Check your subscriptions configuration or try refreshing the feeds.</p>
      <p class="debug-info">Debug: Loading: {loading}, Error: {error}, Videos: {videos.length}</p>
    </div>
  {:else}
    <div class="video-grid">
      {#each videos as video (video.link)}
        <VideoCard {video} />
      {/each}
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    margin-bottom: 4rem;
    padding: 3rem 0;
    position: relative;
  }

  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }

  .header-content {
    position: relative;
    z-index: 1;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin: 0 0 3rem 0;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .refresh-button {
    background: var(--button-bg);
    color: var(--bg-primary);
    border: none;
    padding: 1rem 2rem;
    border-radius: 16px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: var(--shadow-button);
    position: relative;
    overflow: hidden;
  }

  .refresh-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  .refresh-button:hover::before {
    left: 100%;
  }

  .refresh-button:hover:not(:disabled) {
    background: var(--button-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
  }

  .refresh-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .refresh-icon {
    width: 20px;
    height: 20px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid var(--bg-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: var(--bg-modal);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 3rem;
    text-align: center;
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-card);
    display: flex;
    align-items: center;
    gap: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .error-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .error-content h3 {
    margin: 0 0 0.5rem 0;
    color: var(--accent-secondary);
    font-size: 1.25rem;
  }

  .error-content p {
    margin: 0 0 1.5rem 0;
    color: var(--text-secondary);
  }

  .retry-button {
    background: linear-gradient(135deg, #ffffff, #e0e0e0);
    color: var(--bg-primary);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  .empty-state h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
  }

  .empty-state p {
    margin: 0 0 0.5rem 0;
    line-height: 1.6;
  }

  .debug-info {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    font-family: monospace;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    .header {
      margin-bottom: 3rem;
      padding: 2rem 0;
    }

    .video-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .error-message {
      flex-direction: column;
      text-align: center;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1.1rem;
    }

    .refresh-button {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }
  }
</style>
