<!-- Advanced Svelte Component with Animations -->
<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  
  let progress = tweened(0, {
    duration: 2000,
    easing: cubicOut
  });
  
  let skills = [
    { name: 'JavaScript', level: 95, color: '#F7DF1E', currentLevel: 0 },
    { name: 'TypeScript', level: 90, color: '#3178C6', currentLevel: 0 },
    { name: 'React', level: 92, color: '#61DAFB', currentLevel: 0 },
    { name: 'Vue.js', level: 88, color: '#4FC08D', currentLevel: 0 },
    { name: 'Svelte', level: 85, color: '#FF3E00', currentLevel: 0 },
    { name: 'Node.js', level: 87, color: '#339933', currentLevel: 0 }
  ];
  
  let isVisible = false;
  let container;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isVisible) {
            isVisible = true;
            startAnimations();
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (container) {
      observer.observe(container);
    }
    
    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  });
  
  function startAnimations() {
    progress.set(100);
    skills.forEach((skill, index) => {
      setTimeout(() => {
        // Simple animation using setInterval
        let start = 0;
        const target = skill.level;
        const duration = 1500;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
          
          skill.currentLevel = start + (target - start) * eased;
          skills = skills; // trigger reactivity
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        animate();
      }, index * 200);
    });
  }
  
  function resetAnimation() {
    progress.set(0);
    skills.forEach(skill => {
      skill.currentLevel = 0;
    });
    skills = skills; // trigger reactivity
    setTimeout(startAnimations, 100);
  }
</script>

<div bind:this={container} class="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-6">
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      Svelte Skills Dashboard
    </h3>
    <button
      on:click={resetAnimation}
      class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      Animate Again
    </button>
  </div>
  
  <!-- Overall Progress Circle -->
  <div class="flex justify-center mb-8">
    <div class="relative w-32 h-32">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <!-- Background circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke-width="8"
          stroke="#E5E7EB"
          fill="transparent"
        />
        <!-- Progress circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke-width="8"
          stroke="url(#gradient)"
          fill="transparent"
          stroke-dasharray="282.74"
          stroke-dashoffset={282.74 - (282.74 * $progress) / 100}
          stroke-linecap="round"
          class="transition-all duration-1000 ease-out"
        />
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6"/>
            <stop offset="100%" style="stop-color:#EC4899"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {Math.round($progress)}%
        </span>
      </div>
    </div>
  </div>
  
  <!-- Skills List -->
  <div class="space-y-4">
    {#each skills as skill, index}
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-gray-800 dark:text-white">{skill.name}</span>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {Math.round(skill.currentLevel)}%
          </span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-1000 ease-out"
            style="width: {skill.currentLevel}%; background-color: {skill.color}; box-shadow: 0 0 10px {skill.color}40;"
          ></div>
        </div>
        
        <!-- Skill Icon/Color Indicator -->
        <div class="flex items-center mt-2 space-x-2">
          <div 
            class="w-3 h-3 rounded-full"
            style="background-color: {skill.color}"
          ></div>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {skill.level >= 90 ? 'Expert' : skill.level >= 80 ? 'Advanced' : 'Intermediate'} Level
          </span>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Fun Interaction -->
  <div class="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
    <p class="text-center text-sm text-gray-700 dark:text-gray-300">
      🎉 Built with Svelte's reactive magic! Intersection Observer triggers animations when visible.
    </p>
    <div class="flex justify-center mt-2 space-x-2">
      <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
      <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
      <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
    </div>
  </div>
</div>

<style>
  :global(.animate-bounce) {
    animation: bounce 1s infinite;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
</style>
