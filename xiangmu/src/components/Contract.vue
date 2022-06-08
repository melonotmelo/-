<template>
  <el-container class="contract-container">
    <el-header>
      <div>
        <el-page-header @back="goBack" content="租房手续"></el-page-header>
      </div>
    </el-header>

    <el-container>
      <el-aside width="350px">
        <div style="height: 60%; padding-top: 70px; padding-left: 70px">
          <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step title="提交租房申请" description="请确认您的个人信息"></el-step>
            <el-step title="生成订单" description="请核对您的订单信息"></el-step>
            <el-step title="短租缴纳租金" description="若选择短租，需缴纳租金"></el-step>
            <el-step title="长租生成合同" description="若选择长租，则生成合同并下载"></el-step>
          </el-steps>
        </div>
        <div style="padding-top: 30px; padding-left: 120px">
          <el-button type="primary" @click="last">上一步</el-button>
        </div>
      </el-aside>

      <el-main>
        <div style="width: 50%; padding-left: 10%; padding-top: 25px" v-if="active === 0">
          <el-form :model="ruleForm" :rules="rules" ref="applyRef" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="Info.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="Info.sex" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="Info.id_card" disabled></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="Info.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="Info.email" disabled></el-input>
            </el-form-item>
            <el-form-item label="租房方式" prop="rent_way" >
              <el-radio-group v-model="ruleForm.rent_way" @change="handleChange">
                <el-radio :label="'long'" >长租</el-radio>
                <el-radio :label="'short'" >短租</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="起始日期" prop="date1">
              <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="date2">
              <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="ruleForm.date2" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item class="button">
              <el-button @click="reset">重 置</el-button>
              <el-button type="primary" @click="submit">确认信息/下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div style="width: 50%; padding-left: 10%; padding-top: 25px" v-if="active === 1">
          <el-form :model="Info" ref="orderRef" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="Info.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="Info.id_card" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="Info.email" disabled></el-input>
            </el-form-item>
            <el-form-item label="租房方式">
              <el-input v-model="rent_way2" disabled></el-input>
            </el-form-item>
            <el-form-item label="租金">
              <el-input v-model="room.long_price + '元/月'" disabled v-if="ruleForm.rent_way === 'long'"></el-input>
              <el-input v-model="room.short_price + '元/日'" disabled v-if="ruleForm.rent_way === 'short'"></el-input>
            </el-form-item>
            <el-form-item label="起始日期">
              <el-input v-model="ruleForm.date1" disabled></el-input>
            </el-form-item>
            <el-form-item label="结束日期">
              <el-input v-model="ruleForm.date2" disabled></el-input>
            </el-form-item>
            <el-form-item class="button">
              <el-button type="primary" @click="order">生成订单/下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div style="width: 50%; padding-left: 300px; padding-top: 30px" v-if="active === 2">
          <img src="../assets/ma.jpg" width="450px" height="500px">
          <div style="margin-left: 400px; margin-top: 10px">
            <el-button type="primary" @click="next">下一步</el-button>
          </div>
        </div>

        <div style="width: 60%; padding-left: 250px; padding-top: 0" v-if="active === 3">
          <el-row>
            <img src="../assets/contract.png" width="550px" height="550px">
          </el-row>
          <el-row style="margin-left: 350px; margin-top: 10px">
            <el-button type="primary" @click="download('http://81.70.132.82:8000/static/doc/contract.docx')">下载合同</el-button>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-row>

        </div>


      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Contract",
  data(){
    return{
      Info:{
        id: window.sessionStorage.getItem('id'),
        username: window.sessionStorage.getItem('username'),
        sex: window.sessionStorage.getItem('sex') === 'M' ? '男' : '女',
        mobile: window.sessionStorage.getItem('mobile'),
        email: window.sessionStorage.getItem('email'),
        id_card: window.sessionStorage.getItem('id_card'),
      },
      active: 0,
      room: JSON.parse(window.sessionStorage.getItem('room')),
      ruleForm: {
        date1: '',
        date2: '',
        rent_way: '',
      },
      rent_way2: '',
      rules:{
        date1:[
          { required : true, message:'请选择起始日期' ,trigger:'change'},
        ],
        date2:[
          { required : true, message:'请选择结束日期' ,trigger:'change'},
        ],
        rent_way: [
          { required : true, message:'请选择租房方式' ,trigger:'change'},
        ]
      },
    }
  },
  methods: {
    goBack() {
      this.$router.push("/room/info");
    },
    last() {
      if (this.ruleForm.rent_way === 'long') {
        if (this.active === 1 || this.active === 4)
          this.active--;
        else if (this.active === 3)
          this.active -= 2;
      } else if (this.ruleForm.rent_way === 'short') {
        if (this.active === 1 || this.active === 2)
          this.active--;
        else if (this.active === 4)
          this.active -= 2;
      }
    },
    next() {
      if (this.ruleForm.rent_way === 'long') {
        if (this.active === 0)
          this.active++;
        else if (this.active === 1)
          this.active += 2;
        else if (this.active === 3) {
          this.active++;
          this.$message.success("恭喜您，租房成功！");
          this.$router.push("/room");
        }
      }
      else if (this.ruleForm.rent_way === 'short') {
        if (this.active === 0 || this.active === 1)
          this.active++;
        else if (this.active === 2) {
          this.active += 2;
          this.$message.success("恭喜您，租房成功！");
          this.$router.push("/room");
        }
      }
    },

    handleChange(val) {
      //this.rent_way = val;
      console.log(this.ruleForm.rent_way);
    },
    reset() {
      this.$refs.applyRef.resetFields();
    },
    submit() {
      this.$refs.applyRef.validate(valid => {
        if (!valid) return;
        if (this.ruleForm.rent_way === 'long')
          this.rent_way2 = '长租';
        else if (this.ruleForm.rent_way === 'short')
          this.rent_way2 = '短租';
        this.next();
      });
    },
    order() {
      console.log(this.ruleForm.rent_way);
      this.$refs.orderRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await this.$http.post("order/add_roomorder/",
            {
              "user_id": this.Info.id,
              "roomid": this.room.id,
              "long or short": this.ruleForm.rent_way,
              "begintime": this.ruleForm.date1,
              "endtime": this.ruleForm.date2
            });
        console.log(res);
        if (res.result === 1) {
          this.next();
          this.$message.success("订单生成成功");
        } else {
          this.$message.error("啊哦，慢了一步，看看其他房间吧");
        }
      })
    },
    download(url) {
      window.open(url, '_self');
    }
  }
}
</script>

<style lang="less" scoped>
.contract-container{
  height: 100%;
}

.el-header{
  background-color: #FFF9ED;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #FFF9ED;
  margin: 20px;

}

.el-main {
  background-color: #FFF9ED;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
}
.button{
  display: flex;
  justify-content: flex-end;
}
</style>