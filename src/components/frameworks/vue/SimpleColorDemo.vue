<template>
  <div
    class="card mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
  >
    <h3
      class="mb-4 text-center text-xl font-bold text-gray-900 dark:text-white"
    >
      Vue Color Demo
    </h3>

    <div class="mb-4 text-center">
      <div
        class="mx-auto mb-4 h-24 w-24 transform rounded-full transition-all duration-300 hover:scale-110"
        :style="{ backgroundColor: selectedColor }"
      ></div>

      <p class="mb-4 font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ selectedColor }}
      </p>

      <div class="mb-4 grid grid-cols-4 gap-2">
        <button
          v-for="color in colors"
          :key="color"
          @click="selectedColor = color"
          class="h-8 w-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110"
          :style="{ backgroundColor: color }"
        ></button>
      </div>

      <button
        @click="generateRandomColor"
        class="w-full rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
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
import { ref, reactive } from 'vue';

const selectedColor = ref('#3B82F6');

const colors = reactive([
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#84CC16',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F472B6',
]);

const generateRandomColor = () => {
  const randomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
  selectedColor.value = `#${randomHex()}${randomHex()}${randomHex()}`;
};
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
