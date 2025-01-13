import type { z } from 'zod'
import { LinkSchema } from '@/schemas/link'

export default eventHandler(async (event) => {
  // 获取运行时配置中的 previewMode 设置
  const { previewMode } = useRuntimeConfig(event).public

  // 如果是预览模式，则不允许编辑链接，抛出 403 错误
  if (previewMode) {
    throw createError({
      status: 403, // 禁止访问
      statusText: '预览模式无法编辑链接。',
    })
  }

  // 读取并验证请求体中的链接数据
  const link = await readValidatedBody(event, LinkSchema.parse)

  // 获取 Cloudflare 环境和 KV 存储实例
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 获取存储中已存在的链接数据
  const existingLink: z.infer<typeof LinkSchema> | null = await KV.get(`link:${link.slug}`, { type: 'json' })

  // 如果链接存在，执行更新操作
  if (existingLink) {
    // 合并现有的链接数据与新的链接数据
    const newLink = {
      ...existingLink,
      ...link,
      id: existingLink.id, // 不更新 id
      createdAt: existingLink.createdAt, // 不更新 createdAt
      updatedAt: Math.floor(Date.now() / 1000), // 更新更新时间
    }

    // 获取链接的过期时间
    const expiration = getExpiration(event, newLink.expiration)

    // 将更新后的链接数据存储到 KV 中
    await KV.put(`link:${newLink.slug}`, JSON.stringify(newLink), {
      expiration,
      metadata: {
        expiration,
        url: newLink.url,
        comment: newLink.comment,
      },
    })

    // 设置响应状态码为 201（已创建）
    setResponseStatus(event, 201)

    // 生成短链接地址
    const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${newLink.slug}`

    // 返回更新后的链接数据和短链接地址
    return { link: newLink, shortLink }
  }
})
