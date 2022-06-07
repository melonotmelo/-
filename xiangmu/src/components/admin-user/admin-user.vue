<template>
<div>
  <!--面包屑导航区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片视图区域-->
  <el-card >
    <!--搜索与添加区域-->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!--用户列表区域-->
    <el-table :data="userData.userlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="用户id" prop="id"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="tel"></el-table-column>
      <el-table-column label="操作" width="140px">
        <template slot-scope="scope">
          <!--修改按钮-->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <!--删除按钮-->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total">
    </el-pagination>
  </el-card>
  <!--添加用户的对话框-->
  <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
    <!--内容主体区域-->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px" >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password1">
        <el-input v-model="addForm.password1"></el-input>
      </el-form-item>
      <el-form-item label="请再次输入密码" prop="password2">
        <el-input v-model="addForm.password2"></el-input>
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
    </el-form>
    <!--底部区域-->
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
  </el-dialog>
  <!--修改用户的对话框-->
  <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
      <el-form-item label="用户id">
        <el-input v-model="editForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="editForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "admin-user.vue",
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      userData: {
        userlist: [],
        total: 0
      },
      //控制对话框的出现与隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password1: '',
        password2: '',
        email: '',
        mobile:'',
        id:''
      },
      //添加表单的验证规则对象
      addFormRules: {
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
        ]
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible :false,
      //查询到的用户信息对象
      editForm:{
        id:'',
        username:'',
        email:'',
        mobile:''
      },
      editFormRules: {
        email:[
          { required : true, message:'请输入邮箱' ,trigger:'blur'}
        ],
        mobile:[
          { required : true, message:'请输入手机号' ,trigger:'blur'},
          { min :11 ,max:11, message: '手机号不为11位', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods : {
    async getUserList() {
      //const a= await this.$http.get("getUserByAdmin/",{params:{"query":this.queryInfo.query,"pagenum":this.queryInfo.pagenum,"pagesize":this.queryInfo.pagesize}})
      const {data:res1}= await this.$http.get("user/getUserByAdmin/",{params:{"query":this.queryInfo.query,"pagenum":this.queryInfo.pagenum,"pagesize":this.queryInfo.pagesize} })
      console.log(res1)
      if (res1.result !== 1) {
        return this.$message.error('获取用户列表失败!')
      }
      this.$message.success('获取用户列表成功!')
      this.userData.userlist = res1.users
      this.userData.total = res1.all_result_cnt

    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //监听注册对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，进行注册
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发起注册的网络请求
        const {data: res1} = await this.$http.post("user/register/", {
          "username": this.addForm.username,
          "password_1": this.addForm.password1,
          "password_2": this.addForm.password2,
          "email": this.addForm.email,
          "tel": this.addForm.mobile,
          "user_id": this.addForm.id
        });
        if (res1.result === 0) return this.$message.error(res1.msg)
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      //console.log(id)
      const {data:res} =await this.$http.post('user/getuser/',{"id":id})
      console.log(res)
      if(res.result !== 1) return this.$message.error('查询用户信息失败')
      this.editForm.id=id
      this.editForm.username = res.name
      this.editForm.email = res.email
      this.editForm.mobile = res.tel
      this.editDialogVisible = true
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
     editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //发起修改用户请求
        const {data: res} = await this.$http.post('user/updateUserByAdmin/', {
          "id": this.editForm.id,
          "username": this.editForm.username,
          "email": this.editForm.email,
          "tel": this.editForm.mobile
        })
        if(res.result !== 1) return this.$message.error('更新用户信息失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户信息成功')
      })
    },
    //根据Id删除对应的用户信息
    async removeUserById(id) {
      //弹框询问管理员是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err =>{
        return err
      })
      //console.log(confirmResult)
      if(confirmResult!=='confirm') {
        return this.$message.info('已取消删除')
      }
      const {data:res} = await this.$http.post('user/deleteUserByAdmin/',{"id":id})
      if(res.result !== 1) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>