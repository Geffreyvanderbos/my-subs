<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="error-page">
  <div class="error-header">
    <div class="error-number">{$page.status}</div>
    <h1>Something went wrong</h1>
    <p>{$page.error?.message || 'An unexpected error occurred'}</p>
  </div>
  
  {#if $page.status === 500}
    <div class="error-details">
      <h2>Server Error</h2>
      <p>This might be due to:</p>
      <ul>
        <li>Invalid RSS feed URLs in subscriptions.yaml</li>
        <li>Network connectivity issues</li>
        <li>YouTube RSS feed format changes</li>
      </ul>
      <p>Check the browser console and server logs for more details.</p>
    </div>
  {/if}
  
  <div class="error-actions">
    <a href="/" class="home-link">Go back home</a>
    <button class="retry-button" on:click={() => window.location.reload()}>
      Try again
    </button>
  </div>
</div>

<style>
  .error-page {
    max-width: 700px;
    margin: 4rem auto;
    padding: 3rem 2rem;
    text-align: center;
    background: var(--bg-modal);
    border-radius: 24px;
    box-shadow: var(--shadow-card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
  }

  .error-header {
    margin-bottom: 3rem;
  }

  .error-number {
    font-size: 6rem;
    font-weight: 900;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    line-height: 1;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    letter-spacing: -0.01em;
  }

  .error-header p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.6;
  }

  .error-details {
    text-align: left;
    margin: 2rem 0 3rem 0;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    border: 1px solid var(--border-subtle);
  }

  .error-details h2 {
    color: var(--accent-secondary);
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .error-details p {
    margin: 0 0 1rem 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .error-details ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
    color: var(--text-secondary);
  }

  .error-details li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .home-link,
  .retry-button {
    display: inline-block;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: inherit;
  }

  .home-link {
    background: var(--button-bg);
    color: var(--bg-primary);
    box-shadow: var(--shadow-button);
  }

  .home-link:hover {
    background: var(--button-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
  }

  .retry-button {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
  }

  .retry-button:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    border-color: var(--border-accent);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .error-page {
      margin: 2rem 1rem;
      padding: 2rem 1.5rem;
    }

    .error-number {
      font-size: 4rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .error-details {
      padding: 1.5rem;
    }

    .error-actions {
      flex-direction: column;
      align-items: center;
    }

    .home-link,
    .retry-button {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 480px) {
    .error-page {
      padding: 1.5rem 1rem;
    }

    .error-number {
      font-size: 3rem;
    }

    .error-details {
      padding: 1rem;
    }
  }
</style>
