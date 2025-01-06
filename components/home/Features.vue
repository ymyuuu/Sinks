<!-- 改动说明：
1. "URL Shortening" 改动成 "URL缩短"
2. "Analytics" 改动成 "数据分析"
3. "Serverless" 改动成 "无服务器"
4. "Customizable Slug" 改动成 "可自定义Slug"
5. "AI Slug" 改动成 "AI生成Slug"
6. "Link Expiration" 改动成 "链接过期"
-->

<script setup>
import { AreaChart, Hourglass, Link, Paintbrush, ServerOff, Sparkles } from 'lucide-vue-next'

const features = ref([
  {
    title: 'URL缩短', <!-- 改动: URL Shortening -->
    description:
          '将您的URL压缩到最小长度。',
    icon: Link,
  },
  {
    title: '数据分析', <!-- 改动: Analytics -->
    description:
          '监控链接分析并收集有价值的统计数据。',
    icon: AreaChart,
  },
  {
    title: '无服务器', <!-- 改动: Serverless -->
    description:
          '无需传统服务器即可部署。',
    icon: ServerOff,
  },
  {
    title: '可自定义Slug', <!-- 改动: Customizable Slug -->
    description:
          '支持个性化Slug和大小写敏感。',
    icon: Paintbrush,
  },
  {
    title: 'AI生成Slug', <!-- 改动: AI Slug -->
    description:
          '利用AI生成Slug。',
    icon: Sparkles,
  },
  {
    title: '链接过期', <!-- 改动: Link Expiration -->
    description:
          '为您的链接设置过期时间。',
    icon: Hourglass,
  },
])
</script>

<template>
  <main class="pt-16 md:py-12">
    <div class="md:pb-12">
      <h2 class="text-4xl font-bold lg:text-5xl lg:tracking-tight">
        功能 <!-- 改动: Features -->
      </h2>
      <p class="my-8 text-lg md:mb-0 text-slate-600">
        简单且足够的功能
      </p>
    </div>

    <div class="grid gap-8 md:gap-16 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="item in features"
        :key="item.title"
        class="flex items-start gap-4"
      >
        <div class="w-8 h-8 p-2 mt-1 bg-black rounded-full shrink-0">
          <component
            :is="item.icon"
            class="w-4 h-4 text-white"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold">
            {{ item.title }}
          </h3>
          <p class="mt-2 leading-relaxed text-slate-500">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
