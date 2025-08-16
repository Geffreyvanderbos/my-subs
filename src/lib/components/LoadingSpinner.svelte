<div class="loading-spinner">
  <div class="spinner-container">
    <div class="spinner-ring"></div>
    <div class="spinner-ring"></div>
    <div class="spinner-ring"></div>
  </div>
  <p class="loading-text">Loading videos...</p>
</div>

<style>
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
    min-height: 400px;
  }

  .spinner-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin-bottom: 2rem;
  }

  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }

  .spinner-ring:nth-child(1) {
    border-top-color: var(--accent-primary);
    animation-delay: 0s;
  }

  .spinner-ring:nth-child(2) {
    border-right-color: var(--accent-secondary);
    animation-delay: 0.3s;
  }

  .spinner-ring:nth-child(3) {
    border-bottom-color: var(--accent-muted);
    animation-delay: 0.6s;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    margin: 0 0 1.5rem 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: 0.02em;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .loading-spinner {
      padding: 3rem 1rem;
      min-height: 300px;
    }

    .spinner-container {
      width: 60px;
      height: 60px;
      margin-bottom: 1.5rem;
    }

    .loading-text {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .spinner-container {
      width: 50px;
      height: 50px;
    }

    .spinner-ring {
      border-width: 2px;
    }
  }
</style>