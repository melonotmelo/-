<template>
  <el-container class="room-container">
    <!--<header></header>-->
    <!--导航菜单-->
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
               @select="handleSelect" background-color="#FFF9ED" style="padding-left: 15%; padding-right: 15%">
        <el-menu-item index="/room">租房</el-menu-item>
        <el-menu-item index="/center">订单中心</el-menu-item>
        <el-menu-item index="/repair" >投诉与报修</el-menu-item>
        <el-menu-item index="/personalCenter">个人中心</el-menu-item>
        <el-menu-item style="float: right">
          <el-avatar :src="avatar"></el-avatar>
        </el-menu-item>
        <el-menu-item @click="logout" style="float: right">退出登录</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
    <!--搜索框-->
      <div class="header">
        <div style="padding-top: 70px">
          <el-row class="search" type="flex" justify="center">
            <el-col :span="8">
              <el-input
                  placeholder="请输入内容"
                  v-model="searchContent"
                  class="input"
                  style="border-radius: 0"
              ></el-input>
            </el-col>
            <el-button type="primary"  @click="setFlag1">开始找房</el-button>
          </el-row>
        </div>
      </div>

      <!--筛选条件-->
      <div style="width: 60%;margin: 0 auto;padding: 20px">
        <el-row class="crow">
          <label>出租方式 </label>
          <el-radio-group v-model="rent_way" @change="handleChange1">
            <el-radio :label="'long'" >长租</el-radio>
            <el-radio :label="'short'" >短租</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="crow">
          <label>长租月租 </label>
          <el-radio-group :disabled="rent_way === 'short'" v-model="max_price" @change="handleChange2">
            <el-radio :label="1000" >1000元以下</el-radio>
            <el-radio :label="1500" >1500元以下</el-radio>
            <el-radio :label="2000" >2000元以下</el-radio>
            <el-radio :label="3000" >3000元以下</el-radio>
            <el-radio :label="30000" >30000元以下</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="crow">
          <label>短租日租 </label>
          <el-radio-group :disabled="rent_way === 'long'" v-model="max_price" @change="handleChange2">
            <el-radio :label="30" >30元以下</el-radio>
            <el-radio :label="50" >50元以下</el-radio>
            <el-radio :label="70" >70元以下</el-radio>
            <el-radio :label="100" >100元以下</el-radio>
            <el-radio :label="10000" >10000元以下</el-radio>
          </el-radio-group>
        </el-row>
        <el-row style="margin-left: 73%">
          <el-button type="primary" @click="setFlag2" >确认选择</el-button>
        </el-row>
      </div>

      <!--展示搜索信息-->
      <div style="width: 60%;margin: 0 auto;padding: 10px">
        <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            background-color="rgba(255,249,237,0)"
            @select="handleSelect2"
        >
          <el-menu-item index="1">默认排序</el-menu-item>
        </el-menu>
        <el-row>
          <h2>共找到{{all_result_cnt}}套可租房源</h2>
        </el-row>
        <el-divider></el-divider>
        <el-row style="width:100%">
          <el-col style="width:100%; float:left">
            <el-row
                :gutter="25"
                style="height: 200px;padding-top:10px;border-bottom: 1px #DCDFE6 solid"
                v-for="(item, index) in room"
                :key="item.id"
            >
              <el-col :span="5" style="height: 100%">
                <el-row style="height: 90%;">
                  <el-image :src="'http://' + item.imgs[0].url" style="height: 100%; width: 100%"></el-image>
                </el-row>
              </el-col>
              <el-col :span="11">
                <el-row>
                  <h2>{{item.name}}</h2>
                </el-row>
                <el-row class="crow">
                  <span>地址：{{item.address}}</span>
                </el-row>
                <el-row class="crow">
                  <span>简介：{{item.introduction}}</span>
                </el-row>
                <el-row class="crow">
                  <span>更新时间：{{item.update_time.substring(0, 10)}}</span>
                </el-row>
              </el-col>
              <el-col :span="8" style="height: 100%;">
                <el-row>
                  <span style="color:#FF552E;font-weight: bold;font-size: 28px">长租：{{item.long_price}}元/月</span>
                </el-row>
                <el-row>
                  <span style="color:#FF552E;font-weight: bold;font-size: 28px">短租：{{item.short_price}}元/日</span>
                </el-row>
                <el-row style="margin-top: 20%; margin-left: 13%" >
                  <el-button type="primary" @click="Info(index)">详细信息</el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-pagination
            @size-change="size_change"
            @current-change="current_change"
            :current-page.sync="currentPage"
            :page-sizes="[2, 5, 10]"
            :page-size="page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="all_result_cnt"
        ></el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import store from '../store'
export default {
  name: "Room",
  data() {
    return {
      activeIndex: '/room',
      avatar: window.sessionStorage.getItem('avatar'),
      searchContent: window.sessionStorage.getItem('content'),
      activeIndex2: '1',
      rent_way: window.sessionStorage.getItem('rent_way'),
      min_price: window.sessionStorage.getItem('min_price') - 0,
      max_price: window.sessionStorage.getItem('max_price') - 0,
      flag: window.sessionStorage.getItem('flag') - 0,            //标记是search or select
      currentPage: 1,
      page_size: 2,
      all_result_cnt: 0,  //总结果数
      cur_result_cnt: 0,  //当前页结果数
      room: [],
    };
  },
  /*beforeRouteLeave (to, from, next) {
    from.meta.keepAlive = false;
    next();
  },*/
  created() {
    this.searchHouse();
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key === '/room' || key === '/center' || key === '/repair' || key === '/personalCenter'){
        //this.$store.commit('setActiveIndex', key);
        this.$router.push({path: key});
      }
      //this.$router.push({path: key});
    },
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
        /*this.$message({
          type: 'info',
          message: '已取消退出!'
        });*/
      });
    },
    setFlag1(){
      window.sessionStorage.setItem('flag', 1);
      this.flag = 1;
      this.searchHouse();
    },
    setFlag2(){
      window.sessionStorage.setItem('flag', 2);
      this.flag = 2;
      this.searchHouse();
    },
    handleChange1(val){
      this.max_price = 0;
      console.log(this.rent_way);
    },
    handleChange2(val){
      console.log(this.max_price);
    },
    async searchHouse(){
      if(this.flag === 1){
        const {data: res} = await this.$http.get("room/search_room/",
            {params: {'query':this.searchContent, 'pagenum': this.currentPage, 'pagesize': this.page_size}});
        console.log(res);
        if(res.result === 1){
          this.all_result_cnt = res.all_result_cnt;
          this.cur_result_cnt = res.cur_result_cnt;
          this.room = res.room;
          window.sessionStorage.setItem('content', this.searchContent);
        }
        else{
          this.$message.error("无符合条件的房源");
          this.all_result_cnt = 0;
          this.cur_result_cnt = 0;
          this.room = [];
        }
        console.log(this.page_size);
      }
      else if(this.flag === 2){
        const {data: res} = await this.$http.post("room/select_room/",
            {'rent_way': this.rent_way, 'min_price': this.min_price, 'max_price': this.max_price, 'page_num': this.currentPage, 'page_size': this.page_size});
        console.log(res);
        if(res.result === 1){
          this.all_result_cnt = res.all_result_cnt;
          this.cur_result_cnt = res.cur_result_cnt;
          this.room = res.room;
          window.sessionStorage.setItem('min_price', this.min_price);
          window.sessionStorage.setItem('max_price', this.max_price);
          window.sessionStorage.setItem('rent_way', this.rent_way);
        }
        else{
          this.$message.error("无符合条件的房源");
          this.all_result_cnt = 0;
          this.cur_result_cnt = 0;
          this.room = [];
        }
      }
      /*window.sessionStorage.setItem('all_result_cnt', this.all_result_cnt);
      window.sessionStorage.setItem('cur_result_cnt', this.cur_result_cnt);
      window.sessionStorage.setItem('room', this.room);*/
    },
    size_change(val){
      console.log(val);
      this.page_size = val;
      this.searchHouse();
    },
    current_change(val){
      console.log(val);
      this.currentPage = val;
      this.searchHouse();
    },
    handleSelect2(){

    },
    Info(index){
      console.log(this.room[index]);
      window.sessionStorage.setItem('room', JSON.stringify(this.room[index]));
      //let rooms = JSON.stringify(this.room[index]);
      //this.$router.push({path:'/home/info', query: {room: rooms}});
      this.$router.push({path:'/room/info'});
    },
  }
}
</script>

<style scoped>
.room-container{
  background: url("../assets/back.png");
  /*height: 100%;*/
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.header {
  width: 100%;
  height: 180px;
  background: #FFF9ED;
}
span {
  color: #000;
}
.search {
  width: 100%;
}
.crow {
  line-height: 30px;
}
</style>