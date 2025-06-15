<template>
  <div>
    <!-- 1. 页面大标题 -->
    <h1 class="text-3xl font-bold text-white mb-6">特征表</h1>

    <!-- 2. 使用 prose 来美化内容描述区域 -->
    <div class="prose prose-invert max-w-none mb-8" >
      <p>
        这里是 {{ gameName }} 中所有特征的详细列表。你可以通过下方的表格查询它们的ID、种类和效果。
      </p>
    </div>

    <!-- 3. 数据表格 -->
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
          <!-- v-for 循环渲染数据行 -->
          <tr v-for="buff in buffs" :key="buff.buff_id" class="hover:bg-slate-700/50">
            <td class="p-4 font-medium text-white">{{ buff.buff_id }}</td>
            <td class="p-4 ">{{ buff.name }}</td>
            <td class="p-4">{{ buff.type }}</td>
            <td class="p-4">{{ buff.description }}</td>
            <td class="p-4 text-slate-400">{{ buff.comment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const props = defineProps<{
    gameName: string;
}>();

const route = useRoute();
const gameId = computed(() => route.params.gameId as string);

const buffs = [
    { type: '开局特征', buff_id: '3221', name: '手脚灵活', description: '市井中的生活磨练出灵活的身法。 集气速度+5 。', comment: ''},
]
</script>