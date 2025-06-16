<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen flex flex-col">

    <div class="flex flex-1">
      <!-- 
        将 gameId prop 传递给侧边栏，这样侧边栏就知道
        要为哪个游戏生成导航链接了。
      -->
      <WikiSidebar :game-name="gameName?.name ?? ''" />

      <!-- 主内容区 -->
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <!-- 
          子路由组件 (WeaponsList, ArmorsList 等) 将在这里被渲染。
          Vue Router 会自动将子路由的 props (如 gameId) 传递给它们。
        -->
        <router-view :game-name="gameName?.name" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import WikiSidebar from '@/components/WikiSidebar.vue';
import { watch, ref, onMounted } from 'vue';
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

watch(
  () => props.gameId,
  (newId) => {
    loadGameName(newId);
  },
  { immediate: true }
);
</script>