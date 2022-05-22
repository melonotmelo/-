<template>
  <el-container class="all">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="18" :offset="3">
          <el-row>
            <el-col :span="5"><div class="theme">青年租房管理系统</div></el-col>
            <el-col :span="1" :offset="18">
              <img src="../assets/logo.png" alt="">
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-menu-item index="1" @click="flag=1" class="basicInfo">
            <i class="el-icon-user"></i>
            <span slot="title">基本信息</span>
          </el-menu-item>
          <el-menu-item index="2" @click="flag=2" class="modifyInfo">
            <i class="el-icon-edit"></i>
            <span slot="title">资料修改</span>
          </el-menu-item>
          <el-menu-item index="3" @click="flag=3" class="logout">
            <i class="el-icon-setting"></i>
            <span slot="title">退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div v-if="flag===1">111</div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-else-if="flag===2">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div v-else-if="flag===2">222</div>
        <div v-else>333</div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "PersonalCenter",
  data(){
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      flag: 1,
      ruleForm: {
        username: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur'}
        ],
        checkPass: [
          {required: true, validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
  .all {
    background-color: whitesmoke;
  }

  .el-header, .el-footer {
    background-color: darkgrey;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 640px;
    margin-left: 200px;
    margin-top: 15px;
    margin-right: 5px;
  }

  .el-main {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 590px;
    margin-right: 200px;
    margin-top: 15px;
    margin-left: 5px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 30px;
    background-color: #eeeeee;
    margin-top: 4px;
  }

  .el-menu-vertical-demo {
    height: 640px;
  }

  .demo-ruleForm {
    width:450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:  35%;
    transform: translate(-50%,-50%);
  }


</style>

<!--<template>

</template>

<script>
import store from '../store'
//import {getToken} from '@/utils/auth' // 验权
import { mapGetters } from 'vuex'
export default {
  name: "newheader",
  computed: {
    ...mapGetters([
      'name'
    ])

  },
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      input:'',
      loginFlag: true
    };
  },
  created() {
    if(getToken()) {
      store.dispatch('GetInfo').then(res => { // 拉取用户信息
        this.loginOrRegis = this.name
        this.logoutFlag = true
      }).catch((err) => {
        alert("获取用户信息失败")
      })
    }else{

    }
  },
  mounted () {

    this.activeIndex =  this.$route.path;
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.$router.push({path: key})
    },
    ready() {
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition((r) => {
        console.log(r.address.city)
        this.city = r.address.city;

      }, {enableHighAccuracy: true})
    },
    logout(){
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    center() {
      if (this.loginOrRegis === '登录注册') {
        this.$router.push({path:'/login'})
      }else{
        this.$router.push({path:'/center/house'})
      }
    }
  }
}
</script>

<style scoped>

</style>-->