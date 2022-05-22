<template>
  <div>
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="padding-left: 20%; padding-right: 20%">
          <el-menu-item index="/home">租房</el-menu-item>
          <el-menu-item index="/order">订单</el-menu-item>
          <el-menu-item index="/appealRepair" >投诉与报修</el-menu-item>
          <el-menu-item index="/tool">工具</el-menu-item>
          <el-menu-item index="/personalCenter">个人中心</el-menu-item>
          <el-menu-item @click="logout" style="float: right">退出登录</el-menu-item>
        </el-menu>
      </el-header>
    </el-container>
    <div class="header">
      <div style="width: 60%; margin: 0 auto;line-height: 100px">
        <el-row>
          <el-col :span="1" :offset="2" style="cursor: pointer">
            <span>在售</span>
          </el-col>
          <el-col :span="1" style="cursor: pointer">
            <span>小区</span>
          </el-col>
          <el-col :span="2" style="cursor: pointer">
            <span>地图找房</span>
          </el-col>
        </el-row>
      </div>
      <div style="padding-top: 30px">
        <el-row class="search" type="flex" justify="center">
          <el-col :span="8">
            <el-input
                placeholder="请输入内容"
                v-model="searchContent"
                class="input"
                style="border-radius: 0px"
            ></el-input>
          </el-col>
          <el-button type="primary"  @click="searchHouse">开始找房</el-button>
        </el-row>
      </div>
    </div>
    <div style="width: 60%;margin: 0 auto;padding: 20px">
      <el-row class="crow">
        <label>月租 </label>
        <el-checkbox label="2000元以下" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="2000-2500元" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="2500-3000元" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="3000-4000元" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="5000元以上" true-label="1" false-label="0"></el-checkbox>
      </el-row>
      <el-row class="crow">
        <label>房型 </label>
        <el-checkbox label="一室" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="二室" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="三室及以上" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="四室" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="五室及以上" true-label="1" false-label="0" ></el-checkbox>
      </el-row>
      <el-row class="crow">
        <label>面积 </label>
        <el-checkbox label="50㎡以下" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="50㎡-70㎡" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="70㎡-90㎡" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="90㎡-110㎡" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="110㎡-130㎡" true-label="1" false-label="0" ></el-checkbox>
        <el-checkbox label="130㎡以上" true-label="1" false-label="0" ></el-checkbox>
      </el-row>
      <el-row class="crow">
        <label>租期 </label>
        <el-checkbox label="1个月以下" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="1-3个月" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="3-6个月" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="6-12个月" true-label="1" false-label="0"></el-checkbox>
        <el-checkbox label="12个月以上" true-label="1" false-label="0"></el-checkbox>
      </el-row>
    </div>
    <div style="width: 60%;margin: 0 auto;padding: 20px">
      <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect2"
      >
        <el-menu-item index="1">默认排序</el-menu-item>
        <el-menu-item index="3">最新发布</el-menu-item>
        <el-menu-item index="5">房屋月租</el-menu-item>
        <el-menu-item index="6">房屋面积</el-menu-item>
      </el-menu>
      <el-row>
        <h2>共找到{{total}}套可租房源</h2>
      </el-row>
      <el-divider></el-divider>
    </div>

  </div>


  <!--<div style="width: 60%;margin: 0 auto;padding: 20px">
    <el-row class="crow">
      <label>售价</label>
      <el-checkbox label="200万以下" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="200-250" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="250-300" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="300-400" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="400-500" true-label="1" false-label="0"></el-checkbox>
    </el-row>
    <el-row class="crow">
      <label>房型</label>
      <el-checkbox label="一室" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="二室" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="三室" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="四室" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="五室及以上" true-label="1" false-label="0"></el-checkbox>
    </el-row>
    <el-row class="crow">
      <label>面积</label>
      <el-checkbox label="50㎡以下" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="50㎡-70㎡" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="70㎡-90㎡" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="90㎡-110㎡" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="110㎡-130㎡" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="130㎡-150㎡" true-label="1" false-label="0"></el-checkbox>
      <el-checkbox label="150㎡以上" true-label="1" false-label="0"></el-checkbox>
    </el-row>
  </div>
  <div style="width: 60%;margin: 0 auto;padding: 20px">
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
    >
      <el-menu-item index="1">默认排序</el-menu-item>
      <el-menu-item index="3">最新发布</el-menu-item>
      <el-menu-item index="4">房屋总价</el-menu-item>
      <el-menu-item index="5">房屋单价</el-menu-item>
      <el-menu-item index="6">房屋面积</el-menu-item>
    </el-menu>
    <el-row>
      <h2>共找到{{total}}套可租房源</h2>
    </el-row>
    <el-divider></el-divider>
    <el-row style="width:100%">
      <el-col style="width:85%;float:left">
        <el-row
            :gutter="20"
            style="height: 200px;padding-top:20px;cursor:pointer;border-bottom: 1px #DCDFE6 solid"
            v-for="item in list"
            :key="item.id"
            @click.native="info(item.id)">
          <el-col :span="4" style="height: 100%;">
            <el-row style="height: 90%;">
              <el-image :src="item.image[0]" style="height: 100%;"></el-image>
            </el-row>
          </el-col>
          <el-col :span="16">
            <el-row>
              <h2>{{item.house_title}}</h2>
            </el-row>
            <el-row class="crow">
              <span>{{item.house_desc}}</span>
            </el-row>
            <el-row class="crow">
              <span>{{item.rent_way}}|</span>
              <span>{{item.type}}|</span>
              <span>{{item.orientation}}|</span>
              <span>{{item.city}}|{{item.county}}|{{item.address}}|</span>
            </el-row>
            <el-row class="crow">
              <span>0关注</span>
            </el-row>
          </el-col>
          <el-col :span="4" style="height: 100%;">
            <span style="color:red;font-weight: bold;font-size: 28px">{{item.rent}}元/月</span>
            <br />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-pagination
        @size-change="fetchData"
        @current-change="fetchData"
        :current-page.sync="currentPage"
        :page-sizes="[5,10,20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
    ></el-pagination>
  </div>-->
</template>

<script>
import store from '../store'
export default {
  name: "Home",
  data() {
    return {
      activeIndex: '/home',
      activeIndex2: '1',
      input:'',
      loginFlag: true,
      //testImage:"http://117.51.142.27:9003/5eb404d9-76d8-4048-ad69-24ef1243fa67.jpg",
      searchContent: "",
      //list: [],
      total: 0, // 总记录数
      //currentPage: 1, // 当前页
      //pageSize: 10, // 每页大小
      //searchMap: {}
    };
  },

  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.$router.push({path: key})
    },
    handleSelect2(key, keyPath) {
      console.log(key, keyPath);
    },
  }
}
</script>

<style scoped>
  .header {
    width: 100%;
    height: 220px;
    background: #f5f5f6;
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