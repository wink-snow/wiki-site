<template>
  <div class="bg-slate-900 min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-slate-100 text-center mb-12">
        Snowink Wiki
      </h1>
      
      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <GameCard v-for="game in games" :key="game.id" :game="game" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GameCard from '@/components/GameCard.vue';

// TODO: API
const games = ref([
  { id: 'elden-ring', name: '艾尔登法环', imageUrl: 'https://photobeds-1318438545.cos.ap-nanjing.myqcloud.com/img/dreamHeart.jpg' },
  { id: 'cyberpunk-2077', name: '赛博朋克 2077', imageUrl: 'https://photobeds-1318438545.cos.ap-nanjing.myqcloud.com/img/dreamHeart.jpg' },
  { id: 'zelda-botw', name: '塞尔达传说：旷野之息', imageUrl: 'https://photobeds-1318438545.cos.ap-nanjing.myqcloud.com/img/dreamHeart.jpg' },
]);
</script>