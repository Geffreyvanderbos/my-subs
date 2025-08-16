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
    <h1>My YouTube</h1>
    <p class="subtitle">RSS Feed Reader</p>
    
    <button 
      class="refresh-button" 
      on:click={refreshFeeds}
      disabled={refreshing}
    >
      {refreshing ? 'Refreshing...' : 'Refresh Feeds'}
    </button>
  </header>

  {#if error}
    <div class="error-message">
      <p>Error: {error}</p>
      <button class="retry-button" on:click={loadVideos}>Retry</button>
    </div>
  {/if}

  {#if loading}
    <LoadingSpinner />
  {:else if videos.length === 0}
    <div class="empty-state">
      <p>No videos found. Check your subscriptions configuration.</p>
      <p>Debug info: Loading: {loading}, Error: {error}, Videos count: {videos.length}</p>
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    background-color: #f9fafb;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
  }

  .refresh-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .refresh-button:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .refresh-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }

  .error-message {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .error-message p {
    margin: 0 0 1rem 0;
    color: #dc2626;
  }

  .retry-button {
    background-color: #dc2626;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .retry-button:hover {
    background-color: #b91c1c;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .video-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
