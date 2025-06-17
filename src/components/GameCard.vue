<template>
  <!-- 使用 group 来协调内部元素的 hover 状态 -->
  <div 
    class="group block rounded-lg overflow-hidden shadow-lg bg-slate-800 transition-all duration-300 ease-in-out"
    :class="{
      'hover:shadow-cyan-500/30 hover:-translate-y-1 cursor-pointer': isNavigable,
      'opacity-60 cursor-not-allowed': !isNavigable
    }"
    @click="handleCardClick"
  >
    
    <!-- 封面图容器，作为定位的相对父级 -->
    <div class="relative w-full h-48 overflow-hidden">
      <!-- 封面图本身，添加 hover 时的放大效果 -->
      <div 
        class="w-full h-full bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-105"
        :style="{ backgroundImage: `url(${game.image_url})` }">
      </div>
      
      <!-- 状态标签 -->
      <div 
        class="absolute top-2.5 right-2.5 flex items-center gap-x-2 px-2.5 py-1 rounded-full 
               border border-white/20 bg-slate-900/60 backdrop-blur-sm shadow-md"
      >
        <!-- 动态状态指示灯 -->
        <span class="relative flex h-2 w-2">
          <!-- Ping 动画效果 -->
          <span 
            v-if="statusStyles.animate"
            :class="statusStyles.pingClass"
            class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
          ></span>
          <!-- 静态圆点 -->
          <span 
            :class="statusStyles.dotClass"
            class="relative inline-flex rounded-full h-2 w-2"
          ></span>
        </span>
        <!-- 状态文本 -->
        <p class="text-xs font-medium text-slate-200">{{ game.status }}</p>
      </div>
    </div>
    
    <!-- 标题区域 -->
    <div class="p-4">
      <h3 class="text-lg font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
        {{ game.name }}
      </h3>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification.store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const notificationStore = useNotificationStore();
const isNavigable = computed(() => props.game.status === 'Ready-made');

const handleCardClick = () => {
  if (isNavigable.value) {
    router.push(`/wiki/${props.game.id}`);
  } else {
    notificationStore.showNotification(
      `此项目状态为 [${props.game.status}]，暂未开放`,
      'error' 
    );
  }
};

// 使用计算属性来动态生成状态的样式类
const statusStyles = computed(() => {
  switch (props.game.status) {
    case 'Developing':
      return {
        animate: true,
        pingClass: 'bg-yellow-400',
        dotClass: 'bg-yellow-500',
      };
    case 'Ready-made':
      return {
        animate: true,
        pingClass: 'bg-green-400',
        dotClass: 'bg-green-500',
      };
    case 'Updating':
        return {
        animate: true,
        pingClass: 'bg-cyan-400',
        dotClass: 'bg-cyan-500',
      };
    default:
      return {
        animate: false,
        pingClass: 'bg-gray-400',
        dotClass: 'bg-gray-500',
      };
  }
});
</script>