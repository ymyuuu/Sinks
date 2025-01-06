<!-- 改动说明 -->
<!--
1. "Delete successful!" 改动成 "删除成功！"
2. "Are you absolutely sure?" 改动成 "您确定吗？"
3. "This action cannot be undone. This will really delete your link from servers." 改动成 "此操作无法撤销。此操作将从服务器上真正删除您的链接。"
4. "Cancel" 改动成 "取消"
5. "Continue" 改动成 "继续"
-->

<script setup>
import { toast } from 'vue-sonner'

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:link'])

async function deleteLink() {
  await useAPI('/api/link/delete', {
    method: 'POST',
    body: {
      slug: props.link.slug,
    },
  })
  emit('update:link', props.link, 'delete')
  toast('删除成功！') // 提示删除成功
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <AlertDialogHeader>
        <AlertDialogTitle>您确定吗？</AlertDialogTitle> <!-- 确认删除的标题 -->
        <AlertDialogDescription>
          此操作无法撤销。此操作将从服务器上真正删除您的链接。 <!-- 确认删除的描述 -->
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel> <!-- 取消按钮 -->
        <AlertDialogAction @click="deleteLink">
          继续 <!-- 确认删除的按钮 -->
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
