<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { Video } from '../types';

  export let video: Video;
  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();

  let modalElement: HTMLDivElement;
  let videoId: string = '';

  // Extract video ID from YouTube URL
  $: {
    if (video?.link) {
      const url = new URL(video.link);
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        if (url.pathname === '/watch') {
          videoId = url.searchParams.get('v') || '';
        } else if (url.pathname.startsWith('/shorts/')) {
          videoId = url.pathname.split('/shorts/')[1] || '';
        } else if (url.hostname.includes('youtu.be')) {
          videoId = url.pathname.slice(1) || '';
        }
      }
    }
  }

  function closeModal() {
    dispatch('close');
  }

  function openYouTubePage() {
    window.open(video.link, '_blank', 'noopener,noreferrer');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === modalElement) {
      closeModal();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  onMount(() => {
    // Use capture: true to get events before the iframe
    document.addEventListener('keydown', handleKeydown, { capture: true });
    return () => {
      document.removeEventListener('keydown', handleKeydown, { capture: true });
    };
  });


</script>

{#if isOpen}
  <div 
    class="modal-backdrop" 
    class:open={isOpen}
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Enter' && handleBackdropClick(e as any)}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    bind:this={modalElement}
  >
    <div class="modal-container" class:open={isOpen}>
      <div class="modal-header">
        <div class="modal-title">
          <h2 id="modal-title">{video.title}</h2>
          <p class="channel-name">{video.channel}</p>
        </div>
        
        <div class="modal-actions">
          <button 
            class="youtube-link-button"
            on:click={openYouTubePage}
            title="Open on YouTube"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6v2h2v2h2V8h2V6h-2V4h-2v2h-2zM9 9V7H7v2h2zm0 0v2h2V9H9zm0 0H7v2h2V9zm2 2h2v-2h-2v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2zm-6 2h2v-2H7v2zm2 0h2v-2H9v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2zm-6 2h2v-2H7v2zm2 0h2v-2H9v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2zm-6 2h2v-2H7v2zm2 0h2v-2H9v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2zm2 0h2v-2h-2v2z"/>
            </svg>
            YouTube
          </button>
          
          <button 
            class="close-button"
            on:click={closeModal}
            title="Close"
            aria-label="Close video modal"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="modal-content">
        {#if videoId}
          <div class="video-player-container">
            <iframe
              src="https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0"
              title={video.title}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="video-player"
            ></iframe>
          </div>
        {:else}
          <div class="video-fallback">
            <div class="fallback-icon">⚠️</div>
            <h3>Video Unavailable</h3>
            <p>This video cannot be embedded. Please use the YouTube button to watch it on YouTube.</p>
            <button class="fallback-button" on:click={openYouTubePage}>
              Watch on YouTube
            </button>
          </div>
        {/if}

        {#if video.description}
          <div class="video-description">
            <h4>Description</h4>
            <p>{video.description}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(20px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .modal-backdrop.open {
    opacity: 1;
  }

  .modal-container {
    background: var(--bg-primary);
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
    max-width: 90vw;
    max-height: 90vh;
    width: 100%;
    overflow: hidden;
    transform: scale(0.9) translateY(20px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .modal-container.open {
    transform: scale(1) translateY(0);
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
  }

  .modal-title h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    max-width: 600px;
  }

  .channel-name {
    margin: 0;
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .modal-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  .youtube-link-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #ff0000, #cc0000);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .youtube-link-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3);
  }

  .youtube-link-button svg {
    width: 18px;
    height: 18px;
  }

  .close-button {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.75rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--text-primary);
    transform: scale(1.05);
  }

  .close-button svg {
    width: 20px;
    height: 20px;
  }

  .modal-content {
    padding: 2rem;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
  }

  .video-player-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    margin-bottom: 2rem;
    border-radius: 16px;
    overflow: hidden;
    background: #000;
  }

  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 16px;
  }

  .video-fallback {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
  }

  .fallback-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }

  .video-fallback h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
  }

  .video-fallback p {
    margin: 0 0 2rem 0;
    line-height: 1.6;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .fallback-button {
    background: linear-gradient(135deg, #ff0000, #cc0000);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .fallback-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3);
  }

  .video-description {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .video-description h4 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .video-description p {
    margin: 0;
    line-height: 1.6;
    color: var(--text-secondary);
    white-space: pre-wrap;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 1rem;
    }

    .modal-container {
      max-width: 95vw;
      max-height: 95vh;
    }

    .modal-header {
      padding: 1rem 1.5rem;
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .modal-title h2 {
      font-size: 1.25rem;
    }

    .modal-actions {
      justify-content: space-between;
    }

    .modal-content {
      padding: 1.5rem;
    }

    .youtube-link-button {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
    }

    .close-button {
      padding: 0.625rem;
    }
  }

  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0.5rem;
    }

    .modal-container {
      max-width: 98vw;
      max-height: 98vh;
      border-radius: 16px;
    }

    .modal-header {
      padding: 1rem;
    }

    .modal-content {
      padding: 1rem;
    }

    .video-fallback {
      padding: 2rem 1rem;
    }

    .fallback-icon {
      font-size: 3rem;
    }
  }
</style>
