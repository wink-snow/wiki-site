<template>
  <div>
    <h1 class="text-3xl font-bold text-white mb-6">特征表</h1>

    <div class="prose prose-invert max-w-none mb-8">
      <p>
        这里是 {{ gameName }} 中所有特征的详细列表。你可以通过下方的表格查询它们的ID、种类和效果。
      </p>
    </div>

    <!-- 搜索和字段选择控件 -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <!-- 字段选择下拉框 -->
      <div class="flex-shrink-0">
        <select 
          v-model="searchField" 
          class="w-full sm:w-auto h-11 px-4 bg-slate-700 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        >
          <option v-for="option in searchOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <!-- 搜索输入框 -->
      <div class="flex-grow">
        <input 
          type="text" 
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          class="w-full h-11 px-4 bg-slate-700 border border-slate-600 text-white rounded-md placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        />
      </div>
    </div>

    <!-- 加载和错误状态提示 -->
    <div v-if="error" class="bg-red-900/50 text-red-300 p-4 rounded-lg mb-4 text-center">
      <p>数据加载失败：{{ error }}</p>
    </div>

    <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-700">
          <tr>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">ID</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">名称</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">类型</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">效果</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">备注</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          <!-- 加载中状态 -->
          <tr v-if="loading">
            <td colspan="5" class="p-8 text-center text-slate-400">
              <p>正在加载数据...</p>
            </td>
          </tr>
          
          <!-- 无数据状态 -->
          <tr v-else-if="!error && paginatedItems.length === 0">
            <td colspan="5" class="p-8 text-center text-slate-400">
              <p>没有找到任何特征。</p>
            </td>
          </tr>

          <!-- 数据行渲染 -->
          <tr v-else v-for="buff in paginatedItems" :key="buff.buff_id" class="hover:bg-slate-700/50 transition-colors duration-150">
            <td class="p-4 font-medium text-white">{{ buff.buff_id }}</td>
            <td class="p-4 text-slate-200">{{ buff.name }}</td>
            <td class="p-4 text-slate-300">{{ buff.type }}</td>
            <td class="p-4 text-slate-300">{{ buff.description }}</td>
            <td class="p-4 text-slate-400">{{ buff.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div v-if="!loading && total > 0" class="mt-6 flex items-center justify-between text-slate-400">
      <div>
        <span class="text-sm">共 {{ total }} 条</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          上一页
        </button>
        <span class="text-sm font-medium text-white">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          下一页
        </button>
      </div>
    </div>

    <Transition name="fade-up">
      <button 
        v-if="showScrollToTop"
        @click="scrollToTop"
        class="fixed bottom-16 right-8 z-50 w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-300"
        aria-label="回到顶部"
      >
        <!-- 向上箭头 SVG 图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPaginatedResourceList, searchInResourceList, type ResourceItem } from '../../api/index'; 

const props = defineProps<{
  gameName: string;
}>();

const route = useRoute();

// --- 响应式状态定义 ---
const buffs = ref<ResourceItem[]>([]); 
const total = ref(0); // 数据总条数
const currentPage = ref(1);
const pageSize = ref(10); 
const loading = ref(true); 
const error = ref<string | null>(null); // 错误信息

const searchQuery = ref('');
const searchField = ref('name');
const searchOptions = [
  { value: 'name', text: '名称' },
  { value: 'type', text: '类型' },
  { value: 'description', text: '效果' },
  { value: 'comment', text: '备注' },
  { value: 'buff_id', text: 'ID' },
];
const searchPlaceholder = computed(() => {
  const selectedOption = searchOptions.find(opt => opt.value === searchField.value);
  return `在 "${selectedOption?.text}" 中搜索...`;
});

const isSearching = computed(() => searchQuery.value.trim() !== '');

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

const paginatedItems = computed(() => {
  // 如果不是在搜索，直接返回从API获取的当前页数据
  if (!isSearching.value) {
    return buffs.value;
  }
  
  // 如果在搜索，对完整的搜索结果 `buffs` 进行客户端分页
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return buffs.value.slice(startIndex, endIndex);
});

// 从路由获取ID
const gameId = computed(() => {
  // 确保 gameId 是字符串
  const id = route.params.gameId;
  return Array.isArray(id) ? id[0] : id;
});

const fetchData = async (page: number) => {
  // 校验 gameId 是否存在
  if (!gameId.value) {
    error.value = "未能在路由中找到有效的游戏ID。";
    loading.value = false;
    return;
  }
  
  loading.value = true;
  error.value = null;
  try {
    const responseData = await fetchPaginatedResourceList(
      gameId.value,
      'buffs', // 资源类型是 'buffs'
      page,
      pageSize.value
    );
    
    buffs.value = responseData.list;
    total.value = responseData.total;
    currentPage.value = page; // 成功后更新当前页码
    
  } catch (err) {
    console.error(err);
    // 将错误对象转换为更友好的字符串
    error.value = err instanceof Error ? err.message : '一个未知的错误发生了。';
    buffs.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const searchData = async (field: string, keyword: string) => {
  if (!gameId.value) {
    error.value = "未能在路由中找到有效的游戏ID。";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    const responseData = await searchInResourceList(
      gameId.value,
      'buffs',
      field,
      keyword
    );

    buffs.value = responseData.list;
    total.value = responseData.total;
    currentPage.value = 1; // 搜索后重置到第一页

  } catch (err) {
    console.error(err);
    // 将错误对象转换为更友好的字符串
    error.value = err instanceof Error ? err.message : '一个未知的错误发生了。';
    buffs.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

// --- 事件处理器 ---
const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    // 如果不是在搜索，就从API获取新一页的数据
    if (!isSearching.value) {
      fetchData(newPage);
    } else {
      // 如果在搜索，只更新当前页码。`paginatedItems` 计算属性会自动更新视图
      currentPage.value = newPage;
    }
  }
};

const showScrollToTop = ref(false);

// 滚动事件处理器
const handleScroll = () => {
  // 当页面垂直滚动距离大于 400px 时显示按钮
  showScrollToTop.value = window.scrollY > 400;
};

// 点击按钮时，平滑滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// 组件挂载时获取第一页数据
onMounted(() => {
  fetchData(1);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 监听路由参数变化，如果 gameId 变了，则重新从第一页加载数据
watch(gameId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log(`游戏ID从 ${oldId} 变为 ${newId}，重新加载数据。`);
    searchQuery.value = '';
    fetchData(1);
  }
});

watch([searchQuery, searchField], ([newQuery], [oldQuery]) => {
  // 仅在查询内容实际变化时触发
  if (newQuery.trim() !== oldQuery.trim()) { 
    if (isSearching.value) {
      searchData(searchField.value, newQuery.trim());
    } else {
      // 当搜索框清空时，回到默认的第一页
      fetchData(1);
    }
  }
});

</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>