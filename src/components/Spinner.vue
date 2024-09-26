<template>
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  </template>
  
  <style scoped>
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px; /* Adjust based on your layout */
  }
  
  /* Simple CSS Spinner */
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3498db; /* Color of the spinner */
    width: 40px;
    height: 40px;
    animation: spin 1s ease-in-out infinite;
  }
  
  /* Spin animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>