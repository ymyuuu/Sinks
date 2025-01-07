<template>
  <main class="grid gap-8 lg:grid-cols-12">
    <LazyDashboardMetricsLocations class="col-span-1 lg:col-span-8" />
    <DashboardMetricsGroup
      class="lg:col-span-4"
      :tabs="['country', 'region', 'city']"
      :labels="{ country: '国家', region: '地区', city: '城市' }"
    />
    <DashboardMetricsGroup
      class="lg:col-span-6"
      :tabs="['referer', 'slug']"
      :labels="{ referer: '来源', slug: '路径' }"
    />
    <DashboardMetricsGroup
      class="lg:col-span-6"
      :tabs="['language', 'timezone']"
      :labels="{ language: '语言', timezone: '时区' }"
    />
    <DashboardMetricsGroup
      class="lg:col-span-6"
      :tabs="['device', 'deviceType']"
      :labels="{ device: '设备', deviceType: '设备类型' }"
    />
    <DashboardMetricsGroup
      class="lg:col-span-6"
      :tabs="['os', 'browser', 'browserType']"
      :labels="{ os: '操作系统', browser: '浏览器', browserType: '浏览器类型' }"
    />
  </main>
</template>
