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
  { id: 'holy-war', name: '代号：咸鱼杯战', status: 'Developing', imageUrl: 'https://photobeds-1318438545.cos.ap-nanjing.myqcloud.com/img/holy-war.png'},
  { id: 'heros-adventure', name: '大侠立志传：碧血丹心', status: 'Ready-made', imageUrl: 'https://photobeds-1318438545.cos.ap-nanjing.myqcloud.com/img/dxllz-card-img.jpg'},
]);
</script>