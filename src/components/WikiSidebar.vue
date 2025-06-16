<template>
  <aside 
    :class="[
      'w-64 bg-slate-900 p-4 flex-shrink-0 border-r border-slate-700/80 shadow-lg',
      'fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:static md:translate-x-0'
    ]"
  >
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">{{ gameName }}</h2>
        <p class="text-sm text-slate-400">Wiki 导航</p>
      </div>
      <!-- 
        关闭按钮:
        - 只在小屏幕 (<md) 显示
        - 点击时，通过 emit('close') 通知父组件关闭侧边栏
      -->
      <button @click="$emit('close')" class="md:hidden p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
        <span class="sr-only">关闭菜单</span>
        <!-- "X" 图标 SVG -->
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
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
              <router-link
                :to="`/wiki/${gameId}${item.path}`"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md
                       text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400
                       transition-colors duration-200"
                active-class="bg-cyan-500/10 text-cyan-400"
                exact-active-class="bg-cyan-500/10 text-cyan-400"
                >
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const gameId = computed(() => route.params.gameId);

defineProps({
  gameName: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

// 导航结构可以从API获取或在本地定义
const navigation = [
  {
    name: '基础',
    items: [
      { name: '特征', path: '/buffs'},
    ],
  },
  {
    name: '装备（测试，无实际路由）',
    items: [
      { name: '武器', path: '/weapons' },
      { name: '护甲', path: '/armor' },
    ],
  },
];
</script>