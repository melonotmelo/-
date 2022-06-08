<template>
  <div class="login_container" >
    <img src="../assets/登陆背景.jpg">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/头像背景.jpg" alt="">
      </div>
      <!--登陆表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user-fill" placeholder="请输入手机号或邮箱"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-lock-fill" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="success" @click="addDialogVisible = true">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--添加用户的对话框-->
    <el-dialog title="注册" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password1" >
          <el-input v-model="addForm.password1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="请再次输入密码" prop="password2">
          <el-input v-model="addForm.password2" type="password"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="addForm.code"></el-input>
          <el-button type="primary" v-if="flag === 1" size="small" @click="getcode">获取验证码</el-button>
          <el-button type="primary" v-if="flag === 0" size="small" @click="getcode">{{ time }}秒后再发送</el-button>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      //登陆表单绑定的数据
      loginForm:{
        username:"",
        password:""
      },
      //输入的规则
      loginFormRules:{
        //用户名规则
        username: [
          {required: true, message: '请输入邮箱或手机号', trigger: 'blur'},
          {min: 3, max: 20, message: '不符合要求', trigger: 'blur'}
        ],
        //密码规则
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur'}
        ]
      },
      addDialogVisible:false,
      flag: 1,
      time: 0,
      //添加用户的表单数据
      addForm:{
        username: '',
        password1: '',
        password2: '',
        email: '',
        mobile:'',
        id:'',
        code:''
      },
      //添加表单的验证规则对象
      addFormRules:{
        username:[
          { required : true, message:'请输入用户名' ,trigger:'blur'},
          { min :3 ,max:20, message: '用户名的长度在3~20个字符之间', trigger: 'blur'}
        ],
        password1:[
          { required : true, message:'请输入密码' ,trigger:'blur'},
          { min :5 ,max:18, message: '密码的长度在5~18个字符之间', trigger: 'blur'}
        ],
        password2:[
          { required : true, message:'请输入密码' ,trigger:'blur'},
          { min :5 ,max:18, message: '密码的长度在5~18个字符之间', trigger: 'blur'}
        ],
        email:[
          { required : true, message:'请输入邮箱' ,trigger:'blur'}
        ],
        mobile:[
          { required : true, message:'请输入手机号' ,trigger:'blur'},
          { min :11 ,max:11, message: '手机号不为11位', trigger: 'blur'}
        ],
        id:[
          { required : true, message:'请输入身份证号' ,trigger:'blur'},
          { min :18 ,max:18, message: '身份证号不为18位', trigger: 'blur'}
        ],
        code:[
          { required : true, message:'请输入验证码' ,trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    //预验证
    login(){
      this.$refs.loginFormRef.validate( async valid =>{
        if(!valid) return;
        const { data: res }= await this.$http.post("user/login/",
            {"email": this.loginForm.username,"tel": this.loginForm.username,"password": this.loginForm.password});
        if(res.result!==1) return this.$message.error(res.msg);
        this.$message.success("登陆成功");
        window.sessionStorage.setItem("token",res.token);
        if(res.level === 'admin') return await this.$router.push("/home");
        if(res.level === 'user') {
          window.sessionStorage.setItem('id',res.id);
          window.sessionStorage.setItem('password', this.loginForm.password);
          const {data: res2} = await this.$http.post("user/getuser/", {'id': res.id});
          console.log(res2);

          window.sessionStorage.setItem('avatar', 'http://'+res2.avatar);
          window.sessionStorage.setItem('username', res2.name);
          window.sessionStorage.setItem('sex', res2.sex);
          window.sessionStorage.setItem('mobile', res2.tel);
          window.sessionStorage.setItem('email', res2.email);
          window.sessionStorage.setItem('id_card', res2.id_card);

          window.sessionStorage.setItem('flag', 0);
          window.sessionStorage.setItem('min_price', 0);
          window.sessionStorage.setItem('max_price', 0);
          window.sessionStorage.setItem('rent_way', '');
          window.sessionStorage.setItem('content', '');

          return await this.$router.push("/room")//需要胡骄阳和石辛诚补一下地址
        }
      });
    },
    //监听注册对话框的关闭事件
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
    //点击按钮，进行注册
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        //可以发起注册的网络请求
        const {data:res}= await this.$http.post("user/register/",
            {"username":this.addForm.username,"password_1":this.addForm.password1,"password_2":this.addForm.password2,"email":this.addForm.email,"tel":this.addForm.mobile,"user_id":this.addForm.id,"code":this.addForm.code});
        if(res.result === 0) return this.$message.error(res.msg)
        this.$message.success("注册成功");
        this.addDialogVisible=false;
      })
    },
    getcode() {
      const {data:res} = this.$http.post("user/sendEmail/",{"email":this.addForm.email})
      console.log(res)
      if(res.result === 1) {
        this.flag = 0;
        this.time = 60;
        var auth = setInterval(()=>{
          this.time--;
          if(this.time <= 0){
            this.flag = 1;
            clearInterval(auth);
          }
        }, 1000);
        return this.$message.success("验证码已发送到您的邮箱")
      }
      return this.$message.error("发送验证码失败")
    }
  }
}

</script>

<style lang="less" scoped>
    .login_container{
      background-color: #2b4b6b;
      height: 100%;
    }
    .login_box{
      width:450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top:  50%;
      transform: translate(-50%,-50%);

      .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eeeeee;
        }
      }
    }
    .login_form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .btns{
      display: flex;
      justify-content: flex-end;
    }
</style>
