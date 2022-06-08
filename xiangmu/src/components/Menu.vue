<template>
    <el-container class="home-container">
        <!--头部区域-->
        <!-- <el-header>
            <ElCol :span="6" class="logo-container">
              <img src="../assets/houselogo.png" class="logo" alt="">
              <span class="title"> 订单中心</span>
            </ElCol>
            <el-button type="info" round @click="logout">退出</el-button>
        </el-header> -->
        <el-header>
            <el-menu class="el-menu-demo" mode="horizontal" background-color="#FFF9ED">
                <ElCol :span="6" class="logo-container">
                <img src="../assets/houselogo.png" class="logo" alt="">
                <span class="title"> 订单中心</span>
                </ElCol>
                <el-menu-item style="float: right">
                    <el-avatar :src="Info.oldAvatar"></el-avatar>
                </el-menu-item>
                <el-menu-item @click="logout" style="float: right">退出登录</el-menu-item>
            </el-menu>
        </el-header>
        <!--页面主体区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse ? '67' : '200'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边栏菜单区-->
                <el-menu background-color="#FFF9ED" text-color="rgba(23, 19, 46, 0.74)" active-text-color="#ffd04b"
                unique-opened :collapse="isCollapse" :collapse-transition="false">
                <!-- <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                unique-opened :collapse="isCollapse" :collapse-transition="false"> -->
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-circle-plus"></i>
                            <span>选项</span>
                        </template>
                        <el-menu-item-group>
                            <!-- <template slot="title">分组一</template> -->
                            <router-link to="/room/">
                                <el-menu-item index="1-1">
                                    <i class="el-icon-menu"></i>
                                    返回主页
                                </el-menu-item>
                            </router-link>
                            <router-link to="/center/">
                                <el-menu-item index="1-2">
                                    <i class="el-icon-user"></i>
                                    订单中心
                                </el-menu-item>
                            </router-link>
                            <router-link to="/repair/">
                                <el-menu-item index="1-3">
                                    <i class="el-icon-s-tools" :to="{ path: '/repair' }"></i>
                                    故障上报
                                </el-menu-item>
                            </router-link>
                            <router-link to="/complaint/">
                                <el-menu-item index="1-4">
                                    <i class="el-icon-edit" :to="{ path: '/complaint' }"></i>
                                    我要投诉
                                </el-menu-item>
                            </router-link>
                            <router-link to="/feedbacks/">
                                <el-menu-item index="1-5">
                                    <i class="el-icon-finished"></i>
                                    用户反馈
                                </el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main style="background-color: transparent !important">  
                <div>
                    <slot></slot>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "Menu", 
    
    data() {
        return {
            activeIndex: '',
            Info:{
                id: window.sessionStorage.getItem('id'),
                oldAvatar: window.sessionStorage.getItem('avatar'),
                newAvatar: '',
                username: window.sessionStorage.getItem('username'),
                sex: window.sessionStorage.getItem('sex'),
                oldPassword: window.sessionStorage.getItem('password'),
                password1: '',
                password2: '',
                oldMobile: window.sessionStorage.getItem('mobile'),
                newMobile: '',
                oldEmail: window.sessionStorage.getItem('email'),
                newEmail: '',
                id_card: window.sessionStorage.getItem('id_card'),
            },
            //是否折叠
            isCollapse: true
        }
    },
    methods: {
        //点击展开/折叠菜单栏
        logout() {
          this.$confirm('此操作将退出登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '已退出登录!'
            });
            window.sessionStorage.clear();
            this.$router.push({path: '/login'});
          }).catch(() => {

          });
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        handleSelect(key, keyPath) {
            if(key === '/room' || key === '/center' || key === '/repair' || key === '/personalCenter'){
                this.activeIndex = key;
                this.$router.push({path: key});
            }
        },
    },
}
</script>

<style scoped>
.home-container {
    /*
    box-sizing: border-box;
    border-radius: 10px;
    */
    background: url("../assets/back.png");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
}

.el-button {
    background: linear-gradient(#86746f, #948080);
    /* background-color: #4a5064; */
    box-shadow: 0 0 1.5px 1.5px rgb(91, 92, 89);
    height: 20px;
    width: 50px;
    font-size: 7px;
    letter-spacing: 0.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.74);
    font-weight: bold;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.el-aside {
    /* background: linear-gradient(#e8f5f8, #e8f5f8); */
    background-color: transparent !important
}
/* .el-main {
    background: linear-gradient(#e8f5f8, #e8f5f8);
} */
.toggle-button {
    background-color: transparent !important;
    font-size: 7px;
    line-height: 24px;
    color: rgb(184, 184, 184);
    font-weight: bolder;
    text-align: center;
    letter-spacing: 0.9em;
    cursor: pointer;
}
</style>