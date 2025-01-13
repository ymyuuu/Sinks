export default eventHandler(async (event) => {
  // 获取运行时配置中的 previewMode 设置
  const { previewMode } = useRuntimeConfig(event).public

  // 如果是预览模式，则不允许删除链接，抛出 403 错误
  if (previewMode) {
    throw createError({
      status: 403, // 禁止访问
      statusText: '预览模式无法删除链接。',
    })
  }

  // 从请求体中读取 slug 参数
  const { slug } = await readBody(event)
  
  // 如果提供了 slug，执行删除操作
  if (slug) {
    // 获取 Cloudflare 环境和 KV 存储实例
    const { cloudflare } = event.context
    const { KV } = cloudflare.env

    // 删除对应 slug 的链接数据
    await KV.delete(`link:${slug}`)
  }
})
