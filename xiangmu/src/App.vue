<template>
  <div id="app">
      <!-- 路由占位符 -->
    <keep-alive>
      <router-view v-if='$route.meta.keepAlive'/>
    </keep-alive>
    <router-view v-if='!$route.meta.keepAlive'/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
</style>
