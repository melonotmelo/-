<template>
  <div class="back">
    <el-header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
               @select="handleSelect" background-color="#FFF9ED" style="padding-left: 15%; padding-right: 15%">
        <el-menu-item index="/room">租房</el-menu-item>
        <el-menu-item index="/center">订单中心</el-menu-item>
        <el-menu-item index="/repair" >投诉与报修</el-menu-item>
        <el-menu-item index="/personalCenter">个人中心</el-menu-item>
        <el-menu-item style="float: right">
          <el-avatar :src="Info.oldAvatar"></el-avatar>
        </el-menu-item>
        <el-menu-item @click="logout" style="float: right">退出登录</el-menu-item>
      </el-menu>
    </el-header>

    <div class="personal_box">
      <div class="avatar_box" style="cursor:pointer" @click="DialogVisible = true">
        <img :src="Info.oldAvatar" alt="">
      </div>

      <el-form class="user">
        <el-form-item class="username">
          <h1>{{Info.username}}</h1>
          <h2>欢迎来到您的个人世界！</h2>
          <el-divider></el-divider>
          <h2>开启您的旅程吧！</h2>
        </el-form-item>

        <el-form-item class="InfoOp">
          <el-button style="margin-right: 25px" type="primary" icon="el-icon-grape" round @click="DialogVisible1 = true">查看信息</el-button>
          <el-button style="margin-right: 25px" type="success" icon="el-icon-watermelon" round @click="DialogVisible2 = true">修改密码</el-button>
          <el-button style="margin-right: 25px" type="info" icon="el-icon-cherry" round @click="DialogVisible3 = true">修改手机号</el-button>
          <el-button style="margin-right: 25px" type="warning" icon="el-icon-pear" round @click="DialogVisible4 = true">修改邮箱</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="修改头像" :visible.sync="DialogVisible" width="30%" :modal-append-to-body="false" center @close="DialogClosed">
      <el-form ref="avatarRef" label-width="110px" enctype="multipart/form-data">
        <div style="margin-left: 155px">点击选取头像</div>
        <el-form-item>
          <el-upload
              class="avatar-uploader"
              action=""
              ref="upload"
              :http-request="upload"
              :show-file-list="false"
              :auto-upload="false"
              :before-upload="beforeAvatarUpload"
              :on-change="filePreview">
            <img v-if="Info.newAvatar" :src="Info.newAvatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeAvatar">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="个人信息" :visible.sync="DialogVisible1" width="40%" :modal-append-to-body="false" center @close="DialogClosed1">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{Info.username}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-info"></i>
            性别
          </template>
          {{Info.sex}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-postcard"></i>
            身份证号
          </template>
          {{Info.id_card}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{Info.oldMobile}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-promotion"></i>
            邮箱
          </template>
          {{Info.oldEmail}}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="DialogVisible2" width="40%" :modal-append-to-body="false" center @close="DialogClosed2">
      <el-form :model="Info" :rules="Rules" ref="passwordRef" label-width="150px">
        <el-form-item label="旧密码">
          <el-input v-model="Info.oldPassword" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password1">
          <el-input v-model="Info.password1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="Info.password2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="changePwd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改手机号" :visible.sync="DialogVisible3" width="40%" :modal-append-to-body="false" center @close="DialogClosed3">
      <el-form :model="Info" :rules="Rules" ref="mobileRef" label-width="150px">
        <el-form-item label="旧手机号">
          <el-input v-model="Info.oldMobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="新手机号" prop="newMobile">
          <el-input v-model="Info.newMobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="changeMobile">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改邮箱" :visible.sync="DialogVisible4" width="40%" :modal-append-to-body="false" center @close="DialogClosed4">
      <el-form :model="Info" :rules="Rules" ref="emailRef" label-width="150px">
        <el-form-item label="旧邮箱">
          <el-input v-model="Info.oldEmail" disabled></el-input>
        </el-form-item>
        <el-form-item label="新邮箱" prop="newEmail">
          <el-input v-model="Info.newEmail" ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="proof">
          <el-input v-model="Info.proof"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible4 = false">取 消</el-button>
        <el-button type="primary" v-if="flag === 1" @click="proof">发送验证码</el-button>
        <el-button v-if="flag === 0">{{ time }}秒后再发送</el-button>
        <el-button type="primary" @click="changeEmail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '../store'
export default {
  name: "PersonalCenter",
  data() {
    return {
      activeIndex: '/personalCenter',
      Info:{
        id: window.sessionStorage.getItem('id'),
        oldAvatar: window.sessionStorage.getItem('avatar'),
        newAvatar: '',
        username: window.sessionStorage.getItem('username'),
        sex: window.sessionStorage.getItem('sex') === 'M' ? '男' : '女',
        oldPassword: window.sessionStorage.getItem('password'),
        password1: '',
        password2: '',
        oldMobile: window.sessionStorage.getItem('mobile'),
        newMobile: '',
        oldEmail: window.sessionStorage.getItem('email'),
        newEmail: '',
        proof: '',
        id_card: window.sessionStorage.getItem('id_card'),
      },
      flag: 1,
      time: 0,

      DialogVisible: false,
      DialogVisible1: false,
      DialogVisible2: false,
      DialogVisible3: false,
      DialogVisible4: false,

      Rules:{
        password1:[
          { required : true, message:'请输入密码' ,trigger:'blur'},
          { min :5 ,max:18, message: '密码的长度在5~18个字符之间', trigger: 'blur'}
        ],
        password2:[
          { required : true, message:'请再次输入密码' ,trigger:'blur'},
          { min :5 ,max:18, message: '密码的长度在5~18个字符之间', trigger: 'blur'}
        ],
        newEmail:[
          { required: true, message:'请输入邮箱', trigger:'blur'},
        ],
        proof:[
          { required: true, message:'请输入验证码', trigger:'blur'},
        ],
        newMobile:[
          { required: true, message:'请输入手机号', trigger:'blur'},
          { min: 11, max: 11, message: '手机号应为11位', trigger: 'blur'},
        ]
      },
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key === '/room' || key === '/center' || key === '/repair' || key === '/personalCenter'){
        //this.activeIndex = key;
        //this.$store.commit('setActiveIndex', key);
        this.$router.push({path: key});
      }
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

      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    filePreview(e){
      this.Info.newAvatar = URL.createObjectURL(e.raw);
    },

    DialogClosed(){
      this.$refs.avatarRef.resetFields();
      this.Info.newAvatar = '';
    },
    DialogClosed1(){
      this.DialogVisible1 = false;
    },
    DialogClosed2(){
      this.$refs.passwordRef.resetFields();
    },
    DialogClosed3(){
      this.$refs.mobileRef.resetFields();
    },
    DialogClosed4(){
      this.$refs.emailRef.resetFields();
    },

    changeAvatar(){
      this.$refs.upload.submit();
    },
    async upload(file) {
      let fd = new FormData();
      fd.append("id", this.Info.id);
      fd.append("img", file.file);
      const {data: res} = await this.$http.post("user/uploadHeadshot/", fd);
      console.log(res);
      if (res.result === 1) {
        window.sessionStorage.setItem('avatar', 'http://' + res.url);
        this.Info.oldAvatar = 'http://' + res.url;
        this.Info.newAvatar = '';
        this.$message.success("更改头像成功");
        this.$router.go(0);
      }
      this.DialogVisible=false;
    },

    changePwd(){
      if(this.Info.password1 !== this.Info.password2){
        this.$message({
          type: 'error',
          message: '两次密码输入不一致!'
        });
        return;
      }
      else if(this.Info.password1 === this.Info.oldPassword){
        this.$message({
          type: 'error',
          message: '新密码不得与旧密码相同!'
        });
        return;
      }
      this.$refs.passwordRef.validate( async valid =>{
        //
        if(!valid) return;
        const {data: res} = await this.$http.post("user/uploadPassword/",
            {"id": this.Info.id, "oldPassword":this.Info.oldPassword,"newPassword":this.Info.password1});
        console.log(res);
        if(res.result === 1){
          window.sessionStorage.setItem('password', this.Info.password1);
          this.Info.oldPassword = this.Info.password1;
          this.Info.password1 = '';
          this.Info.password2 = '';
          this.$message.success("更改密码成功");
        }
        this.DialogVisible2=false;
      })
    },
    changeMobile(){
      this.$refs.mobileRef.validate( async valid =>{
        //
        if(!valid) return;
        const {data: res} = await this.$http.post("user/uploadTel/",{"id": this.Info.id, "tel":this.Info.newMobile});
        console.log(res);
        if(res.result === 1){
          window.sessionStorage.setItem('mobile', this.Info.newMobile);
          this.Info.oldMobile = this.Info.newMobile;
          this.Info.newMobile = '';
          this.$message.success("更改手机号成功");
        }
        this.DialogVisible3=false;
      })
    },
    changeEmail(){
      this.$refs.emailRef.validate( async valid =>{
        //
        if(!valid) return;
        const {data: res} = await this.$http.post("user/uploadEmail/",{"id": this.Info.id, "email":this.Info.newEmail, "code": this.Info.proof});
        console.log(res);
        if(res.result === 1){
          window.sessionStorage.setItem('email', this.Info.newEmail);
          this.Info.oldEmail = this.Info.newEmail;
          this.Info.newEmail = '';
          this.$message.success("更改邮箱成功");
          this.time = 0;
          this.flag = 1;
        }
        this.DialogVisible4=false;
      })
    },
    async proof(){
      const {data:res}= await this.$http.post("user/sendEmail/", {"email":this.Info.newEmail});
      console.log(res);
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
.back {
  background: url("../assets/back.png");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.personal_box {
  width: 850px;
  height: 400px;
  background-color: rgba(255,249,237,0);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .user{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .username{
      text-align: center;
      padding: 35px 20px;
      //margin-top: 80px;
    }

    .InfoOp{
      padding: 0 20px;
      display: flex;
      justify-content: center;
    }
  }
}
.avatar-uploader {
  //border-color: rgba(255,249,237,0);
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>