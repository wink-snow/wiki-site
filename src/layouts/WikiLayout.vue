<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen flex flex-col">
    <!-- 主体内容容器 -->
    <div class="flex flex-1 relative">
      <!-- 
        遮罩层:
        - 仅在 isSidebarOpen 为 true 且在小屏幕 (<md) 时显示
        - 用于覆盖主内容，点击时关闭侧边栏
        - z-index 设为 30，低于侧边栏(40)，高于主内容
      -->
      <div 
        v-if="isSidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-black/60 z-30 md:hidden"
        aria-hidden="true"
      ></div>

      <!-- 
        侧边栏:
        - 传递 is-open prop，让子组件知道自己的状态
        - 监听 close 事件，由子组件的关闭按钮触发
        - 使用动态 class 实现响应式行为和动画
      -->
      <WikiSidebar 
        :game-name="gameName?.name ?? ''" 
        :is-open="isSidebarOpen"
        @close="closeSidebar"
      />

      <!-- 主内容区 -->
      <div class="flex flex-col flex-1">
        <!-- 
          移动端头部:
          - 只在小屏幕 (<md) 显示
          - 包含汉堡菜单按钮
        -->
        <header class="md:hidden flex items-center justify-between p-4 border-b border-slate-700/80 shadow-md">
          <div class="text-lg font-bold text-white">{{ gameName?.name }}</div>
          <button @click="toggleSidebar" class="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500">
            <span class="sr-only">打开导航菜单</span>
            <!-- 汉堡图标 SVG -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </header>
        
        <main class="flex-1 p-6 md:p-8 overflow-y-auto">
          <router-view :game-name="gameName?.name" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WikiSidebar from '@/components/WikiSidebar.vue';
import { watch, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchGameNameById, type GameName } from '../api/index';

const props = defineProps<{
  gameId: string; // 从路由参数接收 gameId
}>();

const gameName = ref<GameName>();
const isLoading = ref(true);
const error = ref<string | null>(null);

const loadGameName = async (gameId: string) => {
  try {
    const data = await fetchGameNameById(gameId);
    gameName.value = data;
    error.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取游戏名称失败';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadGameName(props.gameId);
});

watch(
  () => props.gameId,
  (newId) => {
    loadGameName(newId);
  },
  { immediate: true }
);

const isSidebarOpen = ref(false);
const route = useRoute();

watch(() => route.path, () => {
  isSidebarOpen.value = false
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}
</script>