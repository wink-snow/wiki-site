<template>
  <div>
    <!-- 1. 页面大标题 -->
    <h1 class="text-3xl font-bold text-white mb-6">武器列表</h1>

    <!-- 2. 使用 prose 来美化内容描述区域 -->
    <div class="prose prose-invert max-w-none mb-8">
      <p>
        这里是《艾尔登法环》中所有武器的详细列表。你可以通过下方的表格查看它们的属性、战技和获取方式。
      </p>
    </div>

    <!-- 3. 数据表格 -->
    <div class="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-700">
          <tr>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">名称</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">类型</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">攻击力</th>
            <th class="p-4 text-sm font-semibold text-slate-300 uppercase">获取方式</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          <!-- v-for 循环渲染数据行 -->
          <tr v-for="weapon in weapons" :key="weapon.name" class="hover:bg-slate-700/50">
            <td class="p-4 font-medium text-white">{{ weapon.name }}</td>
            <td class="p-4">{{ weapon.type }}</td>
            <td class="p-4">{{ weapon.damage }}</td>
            <td class="p-4 text-slate-400">{{ weapon.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// 假设的武器数据
const weapons = [
  { name: '长牙', type: '太刀', damage: '115 (物理)', location: '完成尤拉支线' },
  { name: '暗月大剑', type: '大剑', damage: '112 (魔力)', location: '完成菈妮支线' },
];
</script>