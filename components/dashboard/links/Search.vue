<!-- 改动说明 -->
<!--
1. "Search Links..." 改动成 "搜索链接..."
2. "Search" 改动成 "搜索"
3. "⌘ K" 改动成 "⌘ K"
4. "No links found." 改动成 "未找到链接。"
5. "Links" 改动成 "链接"
6. "Continue" 改动成 "继续"
-->

<script setup>
import { useMagicKeys } from '@vueuse/core'
import { useFuse } from '@vueuse/integrations/useFuse'

const router = useRouter()

const isOpen = ref(false)
const searchTerm = ref('')
const selectedLink = ref(null)

const links = ref([])

const { results: filteredLinks } = useFuse(searchTerm, links, {
  fuseOptions: {
    keys: ['slug', 'url', 'comment'],
  },
  resultLimit: 20,
})

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey))
      e.preventDefault()
  },
})

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1])
    isOpen.value = true
})

function selectLink(link) {
  isOpen.value = false
  router.push({
    path: '/dashboard/link',
    query: { slug: link.slug },
  })
}

async function getLinks() {
  links.value = await useAPI('/api/link/search')
}

onMounted(() => {
  getLinks()
})
</script>

<template>
  <div>
    <Button
      variant="outline"
      size="sm"
      class="relative h-10 w-full justify-start bg-background text-muted-foreground sm:w-32 md:w-48"
      @click="isOpen = true"
    >
      <span class="hidden md:inline-flex">搜索链接...</span> <!-- 改动: 搜索链接... -->
      <span class="inline-flex md:hidden">搜索</span> <!-- 改动: 搜索 -->
      <kbd class="pointer-events-none absolute right-[0.3rem] top-[0.6rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span class="text-xs">⌘</span>K <!-- 改动: ⌘ K -->
      </kbd>
    </Button>
    <Dialog :open="isOpen" @update:open="isOpen = !isOpen">
      <DialogContent class="overflow-hidden p-0 shadow-lg">
        <Command v-model:search-term="searchTerm" v-model="selectedLink" class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="输入搜索内容..." /> <!-- 改动: 输入搜索内容... -->
          <CommandList>
            <CommandEmpty v-if="searchTerm">
              未找到链接。 <!-- 改动: 未找到链接。 -->
            </CommandEmpty>
            <CommandGroup heading="链接"> <!-- 改动: 链接 -->
              <CommandItem v-for="link in filteredLinks" :key="link.item?.id" class="cursor-pointer" :value="link.item" @select="selectLink(link.item)">
                <div class="flex gap-1 w-full">
                  <div class="flex-1 overflow-hidden inline-flex gap-1 items-center">
                    <div class="text-sm font-medium">
                      {{ link.item?.slug }}
                    </div>
                    <div class="text-xs text-muted-foreground flex-1 truncate">
                      ({{ link.item?.url }})
                    </div>
                  </div>
                  <Badge v-if="link.item?.comment" variant="secondary">
                    <div class="max-w-24 truncate">
                      {{ link.item?.comment }}
                    </div>
                  </Badge>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  </div>
</template>
