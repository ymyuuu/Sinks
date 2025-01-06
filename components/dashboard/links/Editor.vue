<!-- 改动说明 -->
<!--
1. 注释内容翻译成中文，保留原代码结构。
2. "Edit Link" 改动成 "编辑链接"。
3. "Create Link" 改动成 "创建链接"。
4. "The preview mode link is valid for up to 24 hours." 改动成 "预览模式的链接有效期最长为 24 小时。"。
5. "Close" 改动成 "关闭"。
6. "Save" 改动成 "保存"。
7. Toast 提示文字翻译为中文："Link updated successfully" 改动成 "链接更新成功"，"Link created successfully" 改动成 "链接创建成功"。
-->

<script setup>
import { DependencyType } from '@/components/ui/auto-form/interface'
import { LinkSchema, nanoid } from '@/schemas/link'
import { toTypedSchema } from '@vee-validate/zod'
import { Shuffle, Sparkles } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

const props = defineProps({
  link: {
    type: Object,
    default: () => ({}), // 默认的链接对象
  },
})

const emit = defineEmits(['update:link'])

const link = ref(props.link)
const dialogOpen = ref(false)

const isEdit = !!props.link.id // 判断是编辑模式还是创建模式

const EditLinkSchema = LinkSchema.pick({
  url: true,
  slug: true,
}).extend({
  optional: LinkSchema.omit({
    id: true,
    url: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
    title: true,
    description: true,
    image: true,
  }).extend({
    expiration: z.coerce.date().optional(), // 过期时间字段，支持可选
  }).optional(),
})

const fieldConfig = {
  slug: {
    disabled: isEdit, // 如果是编辑模式，slug 字段不可编辑
  },
  optional: {
    comment: {
      component: 'textarea', // 评论字段使用多行文本框
    },
  },
}

const dependencies = [
  {
    sourceField: 'slug',
    type: DependencyType.DISABLES,
    targetField: 'slug',
    when: () => isEdit, // 如果是编辑模式，禁用 slug 字段
  },
]

const form = useForm({
  validationSchema: toTypedSchema(EditLinkSchema), // 使用模式校验表单
  initialValues: {
    slug: link.value.slug,
    url: link.value.url,
    optional: {
      comment: link.value.comment,
    },
  },
  validateOnMount: isEdit, // 在编辑模式下挂载时校验
  keepValuesOnUnmount: isEdit, // 在编辑模式下保留卸载时的值
})

// 随机生成 slug
function randomSlug() {
  form.setFieldValue('slug', nanoid()())
}

const aiSlugPending = ref(false)
// AI 生成 slug
async function aiSlug() {
  if (!form.values.url)
    return

  aiSlugPending.value = true
  try {
    const { slug } = await useAPI('/api/link/ai', {
      query: {
        url: form.values.url,
      },
    })
    form.setFieldValue('slug', slug)
  }
  catch (error) {
    console.log(error)
  }
  aiSlugPending.value = false
}

// 组件挂载时设置过期时间
onMounted(() => {
  if (link.value.expiration) {
    form.setFieldValue('optional.expiration', unix2date(link.value.expiration))
  }
})

// 表单提交处理
async function onSubmit(formData) {
  const link = {
    url: formData.url,
    slug: formData.slug,
    ...(formData.optional || []),
    expiration: formData.optional?.expiration ? date2unix(formData.optional?.expiration, 'end') : undefined,
  }
  const { link: newLink } = await useAPI(isEdit ? '/api/link/edit' : '/api/link/create', {
    method: isEdit ? 'PUT' : 'POST',
    body: link,
  })
  dialogOpen.value = false
  emit('update:link', newLink)
  if (isEdit) {
    toast('链接更新成功')
  }
  else {
    toast('链接创建成功')
  }
}

const { previewMode } = useRuntimeConfig().public
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot>
        <Button
          class="ml-2"
          variant="outline"
          @click="randomSlug"
        >
          创建链接
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>{{ link.id ? '编辑链接' : '创建链接' }}</DialogTitle>
      </DialogHeader>
      <p
        v-if="previewMode"
        class="text-sm text-muted-foreground"
      >
        预览模式的链接有效期最长为 24 小时。
      </p>
      <AutoForm
        class="px-2 space-y-2 overflow-y-auto"
        :schema="EditLinkSchema"
        :form="form"
        :field-config="fieldConfig"
        :dependencies="dependencies"
        @submit="onSubmit"
      >
        <template #slug="slotProps">
          <div
            v-if="!isEdit"
            class="relative"
          >
            <div class="absolute right-0 flex space-x-3 top-1">
              <Shuffle
                class="w-4 h-4 cursor-pointer"
                @click="randomSlug"
              />
              <Sparkles
                class="w-4 h-4 cursor-pointer"
                :class="{ 'animate-bounce': aiSlugPending }"
                @click="aiSlug"
              />
            </div>
            <AutoFormField
              v-bind="slotProps"
            />
          </div>
        </template>
        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
              class="mt-2 sm:mt-0"
            >
              关闭
            </Button>
          </DialogClose>
          <Button type="submit">
            保存
          </Button>
        </DialogFooter>
      </AutoForm>
    </DialogContent>
  </Dialog>
</template>
