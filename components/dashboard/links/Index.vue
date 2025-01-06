<!-- 改动说明 -->
<!--
1. 注释内容翻译成中文，保留原代码结构。
2. "No more links" 改动成 "没有更多链接了"
3. "Loading links failed," 改动成 "加载链接失败，"
4. "Try again" 改动成 "重试"
-->

<script setup>
import { useInfiniteScroll } from '@vueuse/core'
import { Loader } from 'lucide-vue-next'

const links = ref([]) // 保存链接列表
const limit = 24 // 每次加载的链接数量限制
let cursor = '' // 用于分页的光标
let listComplete = false // 是否已加载完整的链接列表
let listError = false // 是否加载出错

// 获取链接的函数
async function getLinks() {
  try {
    const data = await useAPI('/api/link/list', {
      query: {
        limit,
        cursor,
      },
    })
    links.value = links.value.concat(data.links).filter(Boolean) // 有时 Cloudflare 会返回 null，过滤掉
    cursor = data.cursor
    listComplete = data.list_complete
    listError = false
  }
  catch (error) {
    console.error(error)
    listError = true
  }
}

// 使用无限滚动加载链接
const { isLoading } = useInfiniteScroll(
  document,
  getLinks,
  {
    distance: 150, // 距离底部的触发距离
    interval: 1000, // 加载间隔
    canLoadMore: () => {
      return !listError && !listComplete // 如果没有出错且列表未加载完成，允许加载更多
    },
  },
)

// 更新链接列表的函数
function updateLinkList(link, type) {
  if (type === 'edit') {
    const index = links.value.findIndex(l => l.id === link.id)
    links.value[index] = link // 编辑链接时更新对应的链接数据
  }
  else if (type === 'delete') {
    const index = links.value.findIndex(l => l.id === link.id)
    links.value.splice(index, 1) // 删除链接时从列表中移除
  }
  else {
    links.value.unshift(link) // 添加新链接时插入到列表开头
  }
}
</script>

<template>
  <main class="space-y-6">
    <div class="flex flex-col gap-6 sm:gap-2 sm:flex-row sm:justify-between">
      <DashboardNav class="flex-1">
        <DashboardLinksEditor @update:link="updateLinkList" />
      </DashboardNav>
      <LazyDashboardLinksSearch />
    </div>
    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardLinksLink
        v-for="link in links"
        :key="link.id"
        :link="link"
        @update:link="updateLinkList"
      />
    </section>
    <div
      v-if="isLoading"
      class="flex items-center justify-center"
    >
      <Loader class="animate-spin" />
    </div>
    <div
      v-if="!isLoading && listComplete"
      class="flex items-center justify-center text-sm"
    >
      没有更多链接了
    </div>
    <div
      v-if="listError"
      class="flex items-center justify-center text-sm"
    >
      加载链接失败，
      <Button variant="link" @click="getLinks">
        重试
      </Button>
    </div>
  </main>
</template>
