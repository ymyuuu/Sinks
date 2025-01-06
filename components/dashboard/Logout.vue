<!-- 改动说明 -->
<!--
1. "LogOut" 改动成 "登出"
2. "Are you sure you want to log out?" 改动成 "您确定要登出吗？"
3. "Cancel" 改动成 "取消"
4. "LogOut" 改动成 "登出"
-->

<script setup>
import { LogOut } from 'lucide-vue-next'

function logOut() {
  localStorage.removeItem('SinkSiteToken')
  navigateTo('/dashboard/login')
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <LogOut
        class="w-4 h-4 cursor-pointer"
      />
    </AlertDialogTrigger>
    <AlertDialogContent class="max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]">
      <AlertDialogHeader>
        <AlertDialogTitle>登出 ? <!-- 改动: 登出 --></AlertDialogTitle>
        <AlertDialogDescription>
          您确定要登出吗？ <!-- 改动: 您确定要登出吗？ -->
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消 <!-- 改动: 取消 --></AlertDialogCancel>
        <AlertDialogAction @click="logOut">
          登出 <!-- 改动: 登出 -->
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
