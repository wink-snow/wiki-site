<template>
  <div class="min-h-screen bg-slate-900">
    <router-view />

    <transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300 transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div 
        v-if="notificationStore.show" 
        class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-x-3 px-6 py-3 rounded-lg 
               bg-slate-800 border shadow-2xl"
        :class="[notificationStore.styles.borderColor, notificationStore.styles.shadowColor]"
      >
        <!-- 动态图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" :class="notificationStore.styles.textColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="notificationStore.styles.icon" />
        </svg>
        <!-- 通知文本 -->
        <p class="text-base font-medium text-slate-200">{{ notificationStore.message }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store';

// 获取通知 store 的实例
const notificationStore = useNotificationStore();
</script>