<template>
  <el-container class="home-container">
    <!--头部区域 -->
    <el-header>
      <ElCol :span="6" class="logo-container">
        <img src="../assets/houselogo.png" class="logo" alt="" width="20%">
        <span class="title"> 青年房屋租赁系统</span>
      </ElCol>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域-->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollpse">|||</div>
        <!--侧边栏菜单区域-->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false"
            router
            :default-active="activePath">
          <!--一级菜单-->
          <el-submenu index="1">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!---图标-->
              <i class="el-icon-s-custom"></i>
              <!--文本-->
              <span>用户管理</span>
            </template>
            <el-menu-item index="admin-user"  @click="saveNavState('/admin-user')">
              <template slot="title">
                <!---图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!---图标-->
              <i class="el-icon-s-home"></i>
              <!--文本-->
              <span>房源管理</span>
            </template>
            <el-menu-item index="admin-house"  @click="saveNavState('/admin-house')">
              <template slot="title">
                <!---图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>房源列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!---图标-->
              <i class="el-icon-s-order"></i>
              <!--文本-->
              <span>订单管理</span>
            </template>
            <el-menu-item index="admin-order"  @click="saveNavState('/admin-order')">
              <template slot="title">
                <!---图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>订单列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!---图标-->
              <i class="el-icon-question"></i>
              <!--文本-->
              <span>反馈管理</span>
            </template>
            <el-menu-item index="admin-feedbacks"  @click="saveNavState('/admin-feedbacks')">
              <template slot="title">
                <!---图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>反馈列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主体区域-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home.vue",
  data() {
    return {
      //是否折叠
      isCollapse: true,
      //被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.saveNavState('/')
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollpse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: rgb(255, 255, 255);
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #EAEDF1;
}
.toggle-button {
  background-color: #333744;
  font-size: 10px;
  line-height: 24px;
  color: rgb(255, 255, 255);
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>