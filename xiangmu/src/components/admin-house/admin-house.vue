<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>房源管理</el-breadcrumb-item>
      <el-breadcrumb-item>房源列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card >
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getRoomList">
            <el-button slot="append" icon="el-icon-search" @click="getRoomList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加房源</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="roomData.roomlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="房源id" prop="id"></el-table-column>
        <el-table-column label="房源名字" prop="name"></el-table-column>
        <el-table-column label="房源地址" prop="address"></el-table-column>
        <el-table-column label="长租价格" prop="long_price"></el-table-column>
        <el-table-column label="短租价格" prop="short_price"></el-table-column>
        <el-table-column label="是否可租">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.available" @change="roomStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="简介" prop="introduction"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOrderById(scope.row.id)"></el-button>
            <el-form enctype="multipart/form-data">
              <el-form-item>
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    :http-request="upload"
                    multiple=""
                    :auto-upload="false"
                >
                  <el-button slot="trigger" size="mini" type="primary" @click="idget(scope.row.id)">选取图片</el-button>
                  <el-button
                      style="margin-left: 10px"
                      size="mini"
                      type="success"
                      @click="submitUpload">上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
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
          :total="this.roomData.total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
        title="添加房源"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addForm" ref="addFormRef" label-width="150px" >
        <el-form-item label="房源名字" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房源地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="长租价格" prop="long_price">
          <el-input v-model="addForm.long_price"></el-input>
        </el-form-item>
        <el-form-item label="短租价格" prop="short_price">
          <el-input v-model="addForm.short_price"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="addForm.introduction"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoom">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
        title="修改房源"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="房源id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="房源名字" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房源地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="长租价格" prop="long_price">
          <el-input v-model="editForm.long_price"></el-input>
        </el-form-item>
        <el-form-item label="短租价格" prop="short_price">
          <el-input v-model="editForm.short_price"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="editForm.introduction"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoomInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "admin-house.vue",
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      roomData: {
        roomlist: [],
        total: 0
      },
      //控制对话框的出现与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        name: '',
        address: '',
        available: true,
        long_price: '',
        short_price: '',
        introduction: ''
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      editForm: {
        id: '',
        name: '',
        address: '',
        long_price: '',
        short_price: '',
        introduction: '',
        available: true
      },
      id: 1
    }
  },
  created() {
    this.getRoomList()
  },
  methods: {
    async getRoomList() {
      //const a= await this.$http.get("getUserByAdmin/",{params:{"query":this.queryInfo.query,"pagenum":this.queryInfo.pagenum,"pagesize":this.queryInfo.pagesize}})
      const {data: res1} = await this.$http.get("room/search_room/", {
        params: {
          "query": this.queryInfo.query,
          "pagenum": this.queryInfo.pagenum,
          "pagesize": this.queryInfo.pagesize,
          "user": null
        }
      })
      console.log(res1)
      if (res1.result !== 1) {
        return this.$message.error('获取房源列表失败!')
      }
      this.$message.success('获取房源列表成功!')
      this.roomData.roomlist = res1.room
      this.roomData.total = res1.all_result_cnt

    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getRoomList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getRoomList()
    },
    async roomStateChanged(roominfo) {
      const {data: res} = await this.$http.post('room/update_room/', {
        "id": roominfo.id,
        "available": roominfo.available
      })
      if (res.result !== 1) {
        roominfo.available = !roominfo.available
        return this.$message.error('更新房源状态失败!')
      }
      this.$message.success('更新房源状态成功')
    },
    //监听注册对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，进行注册
    addRoom() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发起注册的网络请求
        const {data: res1} = await this.$http.post("room/add_room/", {
          "name": this.addForm.name,
          "address": this.addForm.address,
          "available": this.addForm.available,
          "long_price": this.addForm.long_price,
          "short_price": this.addForm.short_price,
          "introduction": this.addForm.introduction
        });
        if (res1.result === 0) return this.$message.error(res1.msg)
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getRoomList()
      })
    },
    async showEditDialog(id) {
      //console.log(id)
      const {data: res} = await this.$http.get('room/get_room/', {params: {"id": id}})
      console.log(res)
      if (res.result !== 1) return this.$message.error('查询房源信息失败')
      this.editForm.id = id
      this.editForm.name = res.room.name
      this.editForm.address = res.room.address
      this.editForm.long_price = res.room.long_price
      this.editForm.short_price = res.room.short_price
      this.editForm.introduction = res.room.introduction
      this.editForm.available = res.room.available
      this.editDialogVisible = true
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editRoomInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //发起修改用户请求
        const {data: res} = await this.$http.post('room/update_room/', {
          "id": this.editForm.id,
          "name": this.editForm.name,
          "address": this.editForm.address,
          "available": this.editForm.available,
          "long_price": this.editForm.long_price,
          "short_price": this.editForm.short_price,
          "introduction": this.editForm.introduction
        })
        if (res.result !== 1) return this.$message.error('更新房源信息失败')
        this.editDialogVisible = false
        this.getRoomList()
        this.$message.success('更新房源信息成功')
      })
    },
    //根据Id删除对应的用户信息
    async removeOrderById(id) {
      //弹框询问管理员是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该房源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      //console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {data: res} = await this.$http.post('room/del_room/', {"id": id})
      if (res.result !== 1) return this.$message.error('删除房源失败')
      this.$message.success('删除房源成功')
      this.getRoomList()
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    upload(file) {
      let fd = new FormData();
      fd.append("id", this.id);
      fd.append("img", file.file);

      console.log(fd);

      this.$http.post('room/upload_room_img/', fd).then((res) => {
        console.log(res.data);
      });
    },
    idget(id) {
      this.id =id
    }
  }
}
</script>

<style lang="less" scoped>

</style>