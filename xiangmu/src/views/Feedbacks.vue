<template>
    <Menu>
        <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/room' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href=".#/center">订单中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>我的反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card" class="tabs">
        <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> 报修反馈</span>
            <MyTable :params="params1"></MyTable>
        </el-tab-pane>
        <el-tab-pane>
            <span slot="label"><i class="el-icon-chat-line-round"></i> 投诉反馈</span>
            <MyTable :params="params2"></MyTable>
        </el-tab-pane>
        </el-tabs>
    </Menu>
</template>

<script>
import Menu from '../components/Menu'
import MyTable from '../components/MyTable'

export default {
    name: 'Feedbacks',
    components: {
        Menu,
        MyTable,
    },
    data() {
        return {
            params1: {user_id: 1, type: '2'}, 
            params2: {user_id: 1, type: '1'},
        }
    },
    methods: {
    
    }
}
</script>

<style>
.tabs {
    margin-top: 15px !important;
}
</style>