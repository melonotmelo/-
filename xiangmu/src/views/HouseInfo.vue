<template>
    <Menu>
        <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href=".#/center">订单中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>房间信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card :body-style="{ padding: '6px' }">
        <el-row>
            <el-col :span="7">
                <img src="../assets/houseInfo.jpg" class="image" width="95%" height="95%">
            </el-col>
            <el-col :span="17">
                <el-descriptions title="房间信息" :column="2" border>
                <el-descriptions-item label="房间号" label-class-name="my-label" content-class-name="my-content">
                    {{ house_id }}</el-descriptions-item>
                <el-descriptions-item label="房间名">{{ house_name }}</el-descriptions-item>
                <el-descriptions-item label="短租价格">{{ shortPrice }}</el-descriptions-item>
                <el-descriptions-item label="长租价格">{{ longPrice }}</el-descriptions-item>
                <el-descriptions-item label="状态">{{ status }}</el-descriptions-item>
                <el-descriptions-item label="简介">
                    <el-tag size="small">{{ introduction }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="地址" :contentStyle="{'text-align': 'center'}">{{ address }}</el-descriptions-item>
                </el-descriptions>
                <!-- <div class="block">
                <span class="demonstration">默认不区分颜色</span>
                <el-rate v-model="value1"></el-rate>
                </div> -->
            </el-col>
        </el-row>  
            <div class="block">
                租客评价：
            <el-rate class="rating"
            v-model="satisfaction"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
            </el-rate>
            </div>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span="4">
                    <span class="demonstration">相关图片</span>
                </el-col>
                <el-col :span="13">
                    <el-carousel height="200px">
                    <el-carousel-item v-for="item in img_src" :key="item">
                        <h3 class="small">
                            <img v-bind:src="item" alt="" width="49%">
                            <img src="http://81.70.132.82:8000/static/media/room/2.jpg" alt="" width="49%" style="float:right">
                        </h3>
                    </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
            <!-- <img src="http://81.70.132.82:8000/static/media/room/0.jpg" alt=""> -->
        </el-card>
    </Menu>
</template>

<script>
import Menu from '../components/Menu'
import axios from 'axios'
import router from '@/router/index'
export default {
    name: "HouseInfo",
    components: {
        Menu,
    },
    
    data() {
        return {
            house_id: 0,
            house_name: '',
            address: '',
            shortPrice: 0,
            longPrice: 0,
            introduction: '',
            status: '',
            satisfaction: 3.7,
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
            img_src: [],
        }
    },

    created() {
        this.getHouseInfo();
    },
    methods: {
        async getHouseInfo() {
            try {
                const res = await axios.get('room/get_room/', {
                    params: {
                        id:this.$route.params.room_id
                        }
                    });
                if(res.status !== 200) {
                    this.$message.error('获取房间信息失败：'+ res.statusText);
                    return;
                } 
                let data = res.data.room;
                this.house_id = data.id;
                this.house_name = data.name;
                this.address = data.address;
                this.shortPrice = data.short_price;
                this.longPrice = data.long_price;
                this.introduction = data.introduction;
                if(data.available == true) {
                    this.status = '当前可租';
                } else {
                    this.status = '当前不可租'
                }
                for(let item of data.imgs) {
                    this.img_src.push("http://" + item.url);
                }
                this.satisfaction = Math.max(0.8, Math.min(5.0, Math.floor(Math.random()* 30 / 10) * 2.2 + 
                3.3 * Math.floor(Math.random() * 2))); 
            } catch(err) {
                this.$message.error('发生未知错误，请重试' + err);
                console.log(err);
            }
        }
    }
}
</script>

<style>
.el-card {
    margin-top: 15px;
    box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
.my-label {
    background: #E1F3D8;
}

.my-content {
    background: #FDE2E2;
}

.block {
    margin-top: 15px;
}

.rating {
    margin-top: 7px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

</style>