<template>
  <el-container class="info-container">
    <el-header>
      <div>
        <el-page-header @back="goBack" content="详细信息"></el-page-header>
      </div>
    </el-header>

    <el-main>
      <el-row style="margin-top: 90px; height: 350px">
        <el-col span=10 style="margin-left: 250px;">
          <el-carousel trigger="click" height="350px">
            <el-carousel-item v-for="item in room.imgs" :key="item">
              <el-image :src="'http://' + item.url" style="height: 100%; width: 100%"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col span=7 style="margin-left: 30px">
          <el-row>
            <span style="color:#FF552E;font-size: 30px">长租：{{room.long_price}} </span>
            <span style="color:#FF552E;"> 元/月</span>
          </el-row>
          <el-row>
            <span style="color:#FF552E;font-size: 30px">短租：{{room.short_price}} </span>
            <span style="color:#FF552E;"> 元/日</span>
          </el-row>
          <el-row style="margin-top: 30px">
            <span >房间名称：{{room.name}}</span>
          </el-row>
          <el-row style="margin-top: 30px">
            <span style="overflow-wrap: break-word;">房间介绍：{{ room.introduction }}</span>
          </el-row>
          <el-row style="margin-top: 30px">
            <span >详细地址：{{room.address}}</span>
          </el-row>
          <el-row style="margin-top: 30px">
            <span >更新时间：{{room.update_time.substring(0, 10)}}</span>
          </el-row>
          <el-row style="margin-top: 30px">
            <span >是否可租：{{room.available === 'false' ? '否' : '是'}}</span>
          </el-row>
          <el-row style="margin-top: 40px">
            <el-col style="margin-left: 200px">
              <el-button type="primary" @click="contract">就 租 它 了 ！</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div>

      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Info.vue",
  data(){
    return{
      room: JSON.parse(window.sessionStorage.getItem('room')),
    }
  },
  /*beforeRouteLeave (to, from, next) {
    if (to.path === "/home") {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next();
  },*/
  methods:{
    goBack(){
      this.$router.push("/room");
    },

    contract(){
      this.$router.push({path:'/room/info/contract'});
    }
  }
}
</script>

<style lang="less" scoped>
.info-container{

  height: 100%;

}

.el-header{
  background-color: #FEFFEF;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-main {
  background: url("../assets/back6.png");
  width: 100%;
  //height: 100%;
  background-size: 100% 100%;

  //background-color: #FEFFEE;
  //margin: 15px;
}
</style>