import { LinkSchema } from '@/schemas/link'

export default eventHandler(async (event) => {
  // 解析并验证请求体中的链接数据
  const link = await readValidatedBody(event, LinkSchema.parse)

  // 获取运行时配置中的 caseSensitive 配置项
  const { caseSensitive } = useRuntimeConfig(event)

  // 如果不区分大小写，将链接的 slug 转换为小写
  if (!caseSensitive) {
    link.slug = link.slug.toLowerCase()
  }

  // 获取 Cloudflare 环境和 KV 存储实例
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  // 查询是否已存在相同的链接
  const existingLink = await KV.get(`link:${link.slug}`)
  if (existingLink) {
    // 如果已存在，抛出 409 错误（冲突）
    throw createError({
      status: 409, // 冲突
      statusText: '链接已存在',
    })
  }

  else {
    // 如果链接不存在，获取链接的过期时间
    const expiration = getExpiration(event, link.expiration)

    // 将链接数据保存到 KV 存储中，并设置过期时间和元数据
    await KV.put(`link:${link.slug}`, JSON.stringify(link), {
      expiration,
      metadata: {
        expiration,
        url: link.url,
        comment: link.comment,
      },
    })

    // 设置响应状态码为 201（已创建）
    setResponseStatus(event, 201)

    // 生成短链接地址
    const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${link.slug}`
    
    // 返回链接数据和短链接地址
    return { link, shortLink }
  }
})
