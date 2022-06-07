<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>处理反馈</el-breadcrumb-item>
      <el-breadcrumb-item>反馈列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type="border-card" class="tabs">
        <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> 报修反馈</span>
            <FeedbackTable :params="params1"></FeedbackTable>
        </el-tab-pane>
        <el-tab-pane>
            <span slot="label"><i class="el-icon-chat-line-round"></i> 投诉反馈</span>
            <FeedbackTable :params="params2"></FeedbackTable>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FeedbackTable from './FeedbackTable'
export default {
    name: "admin-feedbacks.vue",
    components: {
        FeedbackTable,
    },
    data() {
        return {
            params1: {type: '2'},
            params2: {type: '1'},
        }
    }
}
</script>

<style lang="less" scoped>

</style>