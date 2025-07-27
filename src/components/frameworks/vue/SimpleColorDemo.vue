<template>
  <div class="card p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
    <h3 class="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">
      Vue Color Demo
    </h3>
    
    <div class="text-center mb-4">
      <div 
        class="w-24 h-24 mx-auto rounded-full mb-4 transition-all duration-300 transform hover:scale-110"
        :style="{ backgroundColor: selectedColor }"
      ></div>
      
      <p class="text-sm font-mono text-gray-600 dark:text-gray-300 mb-4">
        {{ selectedColor }}
      </p>
      
      <div class="grid grid-cols-4 gap-2 mb-4">
        <button
          v-for="color in colors"
          :key="color"
          @click="selectedColor = color"
          class="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
          :style="{ backgroundColor: color }"
        ></button>
      </div>
      
      <button 
        @click="generateRandomColor"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
      >
        Random Color
      </button>
    </div>
    
    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      ✅ Vue Component Working!
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const selectedColor = ref('#3B82F6')

const colors = reactive([
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
  '#EC4899', '#6366F1', '#14B8A6', '#F472B6'
])

const generateRandomColor = () => {
  const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  selectedColor.value = `#${randomHex()}${randomHex()}${randomHex()}`
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
