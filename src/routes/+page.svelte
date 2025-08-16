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
  let showShorts = false; // Default: hide Shorts

  const feedService = new FeedService();

  // Computed property to filter videos based on Shorts preference
  $: filteredVideos = showShorts 
    ? videos 
    : videos.filter(video => !video.link.includes('/shorts/'));

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
  <title>My Subscriptions - Privacy focused YouTube feed</title>
</svelte:head>

<nav class="navbar">
  <div class="nav-container">
    <div class="nav-content">
      <div class="nav-brand">
        <h1 class="nav-title">My Subscriptions</h1>
        <p class="nav-subtitle">The privacy focused YouTube feed</p>
      </div>
      
      <div class="nav-controls">
        <div class="shorts-toggle">
          <label class="toggle-label" for="shorts-toggle">
            Show Shorts
          </label>
          <div class="toggle-container">
            <input 
              type="checkbox" 
              id="shorts-toggle" 
              bind:checked={showShorts}
              class="toggle-input"
            />
            <label class="toggle-switch" for="shorts-toggle">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <!-- span class="video-count">
            {filteredVideos.length} of {videos.length} videos
          </span-->
        </div>
        
        <button 
          class="refresh-button" 
          on:click={refreshFeeds}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  </div>
</nav>

<main>
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
      {#each filteredVideos as video (video.link)}
        <VideoCard {video} />
      {/each}
    </div>
  {/if}
</main>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem 0;
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .nav-brand {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, var(--text-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .nav-subtitle {
    font-size: 0.875rem;
    color: var(--text-muted);
    font-weight: 400;
    letter-spacing: 0.01em;
    margin: 0;
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .shorts-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .video-count {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: 0.5rem;
    opacity: 0.8;
  }

  .toggle-label {
    cursor: pointer;
    user-select: none;
  }

  .toggle-container {
    position: relative;
    width: 40px;
    height: 20px;
    display: inline-block;
  }

  .toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
  }

  .toggle-switch {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: block;
  }

  .toggle-switch:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: var(--bg-primary);
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .toggle-input:checked + .toggle-switch {
    background-color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .toggle-input:checked + .toggle-switch:before {
    transform: translateX(20px);
    background-color: var(--text-primary);
  }

  .toggle-switch:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .toggle-input:checked + .toggle-switch:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }

  .refresh-button {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    backdrop-filter: blur(10px);
  }

  .refresh-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  .refresh-button:hover::before {
    left: 100%;
  }

  .refresh-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.18);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  .refresh-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .refresh-icon {
    width: 18px;
    height: 18px;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid var(--bg-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 80px);
  }

  .error-message {
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 3rem;
    text-align: center;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .nav-container {
      padding: 0 1rem;
      gap: 1rem;
    }

    .nav-brand h1 {
      font-size: 1.5rem;
    }

    .nav-subtitle {
      font-size: 0.8rem;
    }

    .refresh-button {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
    }

    .button-content span {
      display: none;
    }

    .button-content {
      gap: 0;
    }

    main {
      padding: 1rem;
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
    .nav-container {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .nav-brand {
      text-align: center;
    }

    .refresh-button {
      width: 100%;
      justify-content: center;
    }

    .button-content span {
      display: inline;
    }
  }
</style>
