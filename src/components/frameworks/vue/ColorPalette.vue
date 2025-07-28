<template>
  <div class="card mx-auto max-w-md">
    <div class="text-center">
      <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Color Palette Generator
        <span
          class="mt-1 block text-sm font-normal text-gray-500 dark:text-gray-400"
        >
          Vue Island Component
        </span>
      </h3>

      <!-- Color Display -->
      <div class="mb-6">
        <div
          class="mx-auto mb-4 h-32 w-32 transform rounded-2xl border-4 border-white shadow-lg transition-all duration-300 hover:scale-105 dark:border-gray-800"
          :style="{ backgroundColor: currentColor }"
        ></div>
        <div
          class="inline-block rounded bg-gray-100 px-3 py-1 font-mono text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          {{ currentColor }}
        </div>
      </div>

      <!-- Controls -->
      <div class="mb-6 space-y-4">
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
              >Red</label
            >
            <input
              v-model="red"
              type="range"
              min="0"
              max="255"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-red-200 accent-red-500"
            />
            <div class="mt-1 text-center text-xs text-gray-500">{{ red }}</div>
          </div>
          <div>
            <label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
              >Green</label
            >
            <input
              v-model="green"
              type="range"
              min="0"
              max="255"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-green-200 accent-green-500"
            />
            <div class="mt-1 text-center text-xs text-gray-500">
              {{ green }}
            </div>
          </div>
          <div>
            <label class="mb-1 block text-xs text-gray-600 dark:text-gray-400"
              >Blue</label
            >
            <input
              v-model="blue"
              type="range"
              min="0"
              max="255"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-200 accent-blue-500"
            />
            <div class="mt-1 text-center text-xs text-gray-500">{{ blue }}</div>
          </div>
        </div>

        <div class="flex space-x-2">
          <button @click="randomColor" class="btn-primary flex-1 text-sm">
            🎲 Random
          </button>
          <button @click="resetColor" class="btn-secondary flex-1 text-sm">
            ↺ Reset
          </button>
          <button
            @click="copyColor"
            class="btn-ghost px-3 text-sm"
            :class="{ 'text-green-600 dark:text-green-400': copied }"
          >
            {{ copied ? '✓' : '📋' }}
          </button>
        </div>
      </div>

      <!-- Color Formats -->
      <div class="space-y-2 text-xs">
        <div class="text-left">
          <div class="text-gray-600 dark:text-gray-400">Formats:</div>
          <div
            class="space-y-1 rounded bg-gray-100 p-2 font-mono dark:bg-gray-800"
          >
            <div>
              <span class="text-gray-500">RGB:</span> rgb({{ red }},
              {{ green }}, {{ blue }})
            </div>
            <div><span class="text-gray-500">HSL:</span> {{ hslColor }}</div>
            <div>
              <span class="text-gray-500">HEX:</span> {{ currentColor }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Colors -->
      <div
        v-if="recentColors.length > 0"
        class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700"
      >
        <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Recent Colors:
        </div>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="color in recentColors"
            :key="color"
            @click="setColor(color)"
            class="h-6 w-6 rounded border-2 border-white shadow-sm transition-transform hover:scale-110 dark:border-gray-800"
            :style="{ backgroundColor: color }"
            :title="color"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const red = ref<number>(59);
const green = ref<number>(130);
const blue = ref<number>(246);
const copied = ref<boolean>(false);
const recentColors = ref<string[]>([]);

const currentColor = computed((): string => {
  return `#${toHex(red.value)}${toHex(green.value)}${toHex(blue.value)}`;
});

const hslColor = computed((): string => {
  const [h, s, l] = rgbToHsl(red.value, green.value, blue.value);
  return `hsl(${h}, ${s}%, ${l}%)`;
});

watch(currentColor, (newColor: string, oldColor: string) => {
  if (oldColor && !recentColors.value.includes(oldColor)) {
    recentColors.value.unshift(oldColor);
    if (recentColors.value.length > 8) {
      recentColors.value.pop();
    }
  }
});

const toHex = (value: number): string => {
  const hex = parseInt(value.toString()).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

const randomColor = (): void => {
  red.value = Math.floor(Math.random() * 256);
  green.value = Math.floor(Math.random() * 256);
  blue.value = Math.floor(Math.random() * 256);
};

const resetColor = (): void => {
  red.value = 59;
  green.value = 130;
  blue.value = 246;
};

const copyColor = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(currentColor.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy color:', err);
  }
};

const setColor = (hexColor: string): void => {
  const rgb = hexToRgb(hexColor);
  if (rgb) {
    red.value = rgb.r;
    green.value = rgb.g;
    blue.value = rgb.b;
  }
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHsl = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number,
    s: number,
    l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};
</script>
