<template>
  <div>
    <h1 class="text-3xl font-bold text-white mb-4">
      欢迎来到 {{ gameName }} Wiki
    </h1>
    <div class="prose prose-invert max-w-none">
      <p>请从左侧导航栏选择一个类别以开始浏览。</p>
      <p>
        这里汇集了关于《{{ gameName }}》的全面数据，希望能为你的冒险之旅提供帮助！
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

defineProps<{
  gameName: string;
}>();

const route = useRoute();
</script>