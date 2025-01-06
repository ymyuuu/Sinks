<!-- 改动说明 -->
<!--
1. "Today" 改动成 "今天"
2. "Last 24 hours" 改动成 "过去24小时"
3. "This week" 改动成 "本周"
4. "Last 7 days" 改动成 "过去7天"
5. "This month" 改动成 "本月"
6. "Last 30 days" 改动成 "过去30天"
7. "Last 90 days" 改动成 "过去90天"
8. "Custom" 改动成 "自定义"
9. "Custom Date" 改动成 "自定义日期"
10. "Date" 改动成 "日期"
11. "Date Range" 改动成 "日期范围"
-->

<script setup>
import { now, startOfMonth, startOfWeek } from '@internationalized/date'

const emit = defineEmits(['update:dateRange'])

const startAt = inject('startAt')
const endAt = inject('endAt')

const dateRange = ref('last-7d')
const openCustomDateRange = ref(false)
const customDate = ref()
const customDateRange = ref()

const locale = getLocale()

function updateCustomDate(customDateValue) {
  emit('update:dateRange', [date2unix(customDateValue, 'start'), date2unix(customDateValue, 'end')])
  openCustomDateRange.value = false
  customDate.value = undefined
}

function updateCustomDateRange(customDateRangeValue) {
  if (customDateRangeValue.start && customDateRangeValue.end) {
    emit('update:dateRange', [date2unix(customDateRangeValue.start, 'start'), date2unix(customDateRangeValue.end, 'end')])
    openCustomDateRange.value = false
    customDateRange.value = undefined
  }
}

function isDateDisabled(dateValue) {
  return dateValue.toDate() > new Date()
}

watch(dateRange, (newValue) => {
  switch (newValue) {
    case 'today':
      emit('update:dateRange', [date2unix(now(), 'start'), date2unix(now())])
      break
    case 'last-24h':
      emit('update:dateRange', [date2unix(now().subtract({ hours: 24 })), date2unix(now())])
      break
    case 'this-week':
      emit('update:dateRange', [date2unix(startOfWeek(now(), locale), 'start'), date2unix(now())])
      break
    case 'last-7d':
      emit('update:dateRange', [date2unix(now().subtract({ days: 7 })), date2unix(now())])
      break
    case 'this-month':
      emit('update:dateRange', [date2unix(startOfMonth(now()), 'start'), date2unix(now())])
      break
    case 'last-30d':
      emit('update:dateRange', [date2unix(now().subtract({ days: 30 })), date2unix(now())])
      break
    case 'last-90d':
      emit('update:dateRange', [date2unix(now().subtract({ days: 90 })), date2unix(now())])
      break
    case 'custom':
      openCustomDateRange.value = true
      dateRange.value = null
      break
    default:
      break
  }
})
</script>

<template>
  <Select v-model="dateRange">
    <SelectTrigger>
      <SelectValue v-if="dateRange" />
      <div v-else>
        {{ shortDate(startAt) }} - {{ shortDate(endAt) }}
      </div>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="today">
        今天 <!-- 改动: 今天 -->
      </SelectItem>
      <SelectItem value="last-24h">
        过去24小时 <!-- 改动: 过去24小时 -->
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="this-week">
        本周 <!-- 改动: 本周 -->
      </SelectItem>
      <SelectItem value="last-7d">
        过去7天 <!-- 改动: 过去7天 -->
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="this-month">
        本月 <!-- 改动: 本月 -->
      </SelectItem>
      <SelectItem value="last-30d">
        过去30天 <!-- 改动: 过去30天 -->
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="last-90d">
        过去90天 <!-- 改动: 过去90天 -->
      </SelectItem>
      <SelectSeparator />
      <SelectItem value="custom">
        自定义 <!-- 改动: 自定义 -->
      </SelectItem>
    </SelectContent>
  </Select>

  <Dialog v-model:open="openCustomDateRange">
    <DialogContent class="w-auto max-w-[95svw] max-h-[95svh] md:max-w-screen-md grid-rows-[auto_minmax(0,1fr)_auto]">
      <DialogHeader>
        <DialogTitle>自定义日期 <!-- 改动: 自定义日期 --></DialogTitle>
      </DialogHeader>
      <Tabs
        default-value="range"
      >
        <div class="flex justify-center">
          <TabsList>
            <TabsTrigger value="date">
              日期 <!-- 改动: 日期 -->
            </TabsTrigger>
            <TabsTrigger value="range">
              日期范围 <!-- 改动: 日期范围 -->
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="date"
          class="overflow-y-auto h-80"
        >
          <Calendar
            :model-value="customDate"
            weekday-format="short"
            :is-date-disabled="isDateDisabled"
            @update:model-value="updateCustomDate"
          />
        </TabsContent>
        <TabsContent
          value="range"
          class="overflow-y-auto h-80"
        >
          <RangeCalendar
            :model-value="customDateRange"
            initial-focus
            weekday-format="short"
            :number-of-months="2"
            :is-date-disabled="isDateDisabled"
            @update:model-value="updateCustomDateRange"
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
