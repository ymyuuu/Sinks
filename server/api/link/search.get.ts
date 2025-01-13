interface Link {
  slug: string
  url: string
  comment?: string
}

export default eventHandler(async (event) => {
  // 获取 Cloudflare 环境和 KV 存储实例
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  
  // 初始化链接列表和游标
  const list: Link[] = []
  let finalCursor: string | undefined

  try {
    while (true) {
      // 从 KV 存储中获取以 'link:' 为前缀的键值对列表
      const { keys, list_complete, cursor } = await KV.list({
        prefix: `link:`,
        limit: 1000,  // 每次最多获取 1000 个条目
        cursor: finalCursor,  // 上次查询的游标
      })

      finalCursor = cursor

      // 如果获取到的 keys 是数组，处理这些键值
      if (Array.isArray(keys)) {
        for (const key of keys) {
          try {
            // 如果键有 metadata 并且包含 url 字段，加入列表
            if (key.metadata?.url) {
              list.push({
                slug: key.name.replace('link:', ''),
                url: key.metadata.url,
                comment: key.metadata.comment,
              })
            }
            else {
              // 如果没有 metadata 字段，进行向后兼容处理
              const { metadata, value: link } = await KV.getWithMetadata(key.name, { type: 'json' })
              if (link) {
                // 将链接数据添加到列表中
                list.push({
                  slug: key.name.replace('link:', ''),
                  url: link.url,
                  comment: link.comment,
                })

                // 更新链接的 metadata
                await KV.put(key.name, JSON.stringify(link), {
                  expiration: metadata?.expiration,
                  metadata: {
                    ...metadata,
                    url: link.url,
                    comment: link.comment,
                  },
                })
              }
            }
          }
          catch (err) {
            // 处理每个键时出现的错误，跳过当前键继续下一个
            console.error(`处理键 ${key.name} 时出错:`, err)
            continue
          }
        }
      }

      // 如果没有获取到 keys 或者列表已完整，退出循环
      if (!keys || list_complete) {
        break
      }
    }
    // 返回链接列表
    return list
  }
  catch (err) {
    // 捕获整个过程中的错误并返回 500 错误
    console.error('获取链接列表时出错:', err)
    throw createError({
      statusCode: 500,
      message: '无法获取链接列表',
    })
  }
})
