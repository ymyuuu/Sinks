<!-- 改动说明 -->
<!--
1. "Links" 改动成 "链接"
2. "Analysis" 改动成 "分析"
-->

<script setup>
const route = useRoute()
</script>

<template>
  <section class="flex justify-between">
    <Tabs
      v-if="route.path !== '/dashboard/link'"
      :default-value="route.path"
      @update:model-value="navigateTo"
    >
      <TabsList>
        <TabsTrigger
          value="/dashboard/links"
        >
          链接 <!-- 改动: 链接 -->
        </TabsTrigger>
        <TabsTrigger value="/dashboard/analysis">
          分析 <!-- 改动: 分析 -->
        </TabsTrigger>
      </TabsList>
    </Tabs>
    <slot name="left" />
    <div>
      <slot />
    </div>
  </section>
</template>
