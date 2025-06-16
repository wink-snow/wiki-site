<template>
  <div>
    <h1 class="text-3xl font-bold text-white mb-6">特征表</h1>

    <div class="prose prose-invert max-w-none mb-8">
      <p>
        这里是 {{ gameName }} 中所有特征的详细列表。你可以通过下方的表格查询它们的ID、种类和效果。
      </p>
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
          <tr v-else-if="!error && buffs.length === 0">
            <td colspan="5" class="p-8 text-center text-slate-400">
              <p>没有找到任何特征。</p>
            </td>
          </tr>

          <!-- 数据行渲染 -->
          <tr v-else v-for="buff in buffs" :key="buff.buff_id" class="hover:bg-slate-700/50 transition-colors duration-150">
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPaginatedResourceList, type ResourceItem } from '../../api/index'; 

const props = defineProps<{
  gameName: string;
}>();

const route = useRoute();

// --- 响应式状态定义 ---
const buffs = ref<ResourceItem[]>([]); // 表格当前页的数据
const total = ref(0); // 数据总条数
const currentPage = ref(1); // 当前页码
const pageSize = ref(20); // 每页显示条数
const loading = ref(true); // 加载状态
const error = ref<string | null>(null); // 错误信息

// --- 计算属性 ---
// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

// 从路由获取游戏ID
const gameId = computed(() => {
  // 确保 gameId 是字符串
  const id = route.params.gameId;
  return Array.isArray(id) ? id[0] : id;
});

// --- API 调用逻辑 ---
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

// --- 事件处理器 ---
const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    fetchData(newPage);
  }
};

// --- 生命周期钩子 ---
// 组件挂载时获取第一页数据
onMounted(() => {
  fetchData(1);
});

// 监听路由参数变化，如果 gameId 变了，则重新从第一页加载数据
watch(gameId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log(`游戏ID从 ${oldId} 变为 ${newId}，重新加载数据。`);
    fetchData(1);
  }
});

</script>