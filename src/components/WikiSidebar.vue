<template>
  <!-- 在 md 及以上屏幕为 block，以下为 hidden (配合JS控制显示) -->
  <aside class="w-64 p-4 flex-shrink-0 border-r border-slate-700/80 shadow-lg hidden md:block">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-white">艾尔登法环</h2>
      <p class="text-sm text-slate-400">Wiki 导航</p>
    </div>

    <nav>
      <ul>
        <!-- 导航分类 -->
        <li v-for="category in navigation" :key="category.name" class="mb-4">
          <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {{ category.name }}
          </h3>
          <ul>
            <!-- 具体链接 -->
            <li v-for="item in category.items" :key="item.path">
              <!-- 使用 Vue Router 的 RouterLink 并利用 v-slot 获取激活状态 -->
              <router-link
                :to="`/wiki/${gameId}${item.path}`"
                v-slot="{ isActive }"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md
                       transition-colors duration-200"
                :class="[
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-700'
                ]"
              >
                <!-- 可以加个图标 -->
                <!-- <component :is="item.icon" class="h-5 w-5 mr-3" /> -->
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const gameId = computed(() => route.params.gameId);
// 导航结构可以从API获取或在本地定义
const navigation = [
  {
    name: '基础',
    items: [
      { name: '职业', path: '/classes' },
      { name: '属性', path: '/stats' },
    ],
  },
  {
    name: '装备',
    items: [
      { name: '武器', path: '/weapons' },
      { name: '护甲', path: '/armors' },
      { name: '护符', path: '/talismans' },
    ],
  },
];
</script>