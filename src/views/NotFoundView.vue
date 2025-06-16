<template>
  <div class="fixed inset-0 bg-slate-900 flex items-center justify-center p-8 z-50">
    <div class="text-center">
      <p class="text-lg font-semibold text-slate-300 mb-2">404</p>
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-wider">
        页面不见了
      </h1>
      <p class="text-slate-400 mt-6 mb-10 max-w-lg mx-auto">
        哎呀！大侠要寻找的页面似乎已经迷失在宇宙中了。请检查链接是否正确，或联系站长同学寻求帮助。
      </p>
      
      <router-link
        to="/"
        class="text-indigo-400 font-bold py-2 px-4 rounded-lg hover:bg-slate-800 hover:text-indigo-300 transition-colors duration-300"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

// 无需额外逻辑
</script>

<style scoped>
/* 所有样式均由 Tailwind CSS 处理 */
</style>