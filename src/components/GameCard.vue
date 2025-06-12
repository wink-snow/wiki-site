<template>
  <!-- 使用 RouterLink 实现点击跳转 -->
  <router-link :to="`/wiki/${game.id}`" class="group block">
    <div class="bg-slate-800 rounded-lg overflow-hidden shadow-lg 
                transition-all duration-300 ease-in-out
                hover:shadow-cyan-500/30 hover:scale-105">
      
      <!-- 封面图 -->
      <img :src="game.imageUrl" :alt="game.name" 
           class="w-full h-48 object-cover">
      
      <!-- 标题 -->
      <div class="p-4">
        <h3 class="text-lg font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
          {{ game.name }}
        </h3>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  game: {
    type: Object,
    required: true,
  },
});
</script>