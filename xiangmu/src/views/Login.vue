<template>
  <div class="about">
    <h1>This is a login page</h1>
    <el-button v-if="!this.$store.state.isLogin" v-on:click="login" type="primary">
        登录
    </el-button>
    <router-link to="/center">
        <el-button v-if="this.$store.state.isLogin" type="primary">
            查看订单
        </el-button>
    </router-link>
    <el-button v-if="this.$store.state.isLogin" v-on:click="logout" type="info">
        退出
    </el-button>
  </div>
</template>

<script>

export default {
    name: "login", 
    methods: {
        login() {
            this.$store.commit('login')
        },
        logout() {
            this.$store.commit('logout')
        },
    },
};
</script>

<style scoped>
.about {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
    box-shadow: 0 0 10px 10px rgb(246, 245, 245);
    border-radius: 10px;
}
</style>