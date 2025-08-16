<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="error-page">
  <h1>Error {$page.status}</h1>
  <p>{$page.error?.message || 'Something went wrong'}</p>
  
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
  
  <a href="/" class="home-link">Go back home</a>
</div>

<style>
  .error-page {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    text-align: center;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .error-details {
    text-align: left;
    margin: 2rem 0;
    padding: 1rem;
    background: #fef2f2;
    border-radius: 6px;
    border: 1px solid #fecaca;
  }

  .error-details h2 {
    color: #dc2626;
    margin-top: 0;
  }

  .error-details ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .home-link {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }

  .home-link:hover {
    background: #2563eb;
  }
</style>
