<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card >
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加订单</el-button>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="orderData.orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单id" prop="id"></el-table-column>
        <el-table-column label="房源id" prop="roomid"></el-table-column>
        <el-table-column label="房源地址" prop="address"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="长租价格" prop="long_price"></el-table-column>
        <el-table-column label="短租价格" prop="short_price"></el-table-column>
        <el-table-column label="开始时间" prop="begintime"></el-table-column>
        <el-table-column label="到期时间" prop="endtime"></el-table-column>
        <el-table-column label="是否通过">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.type" @change="orderStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOrderById(scope.row.id)"></el-button>
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
          :total="orderData.total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
        title="添加订单"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addForm" ref="addFormRef" label-width="150px" >
        <el-form-item label="房间id" prop="roomid">
          <el-input v-model="addForm.roomid"></el-input>
        </el-form-item>
        <el-form-item label="房间名字" prop="roomname">
          <el-input v-model="addForm.roomname"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="租房开始时间" prop="begintime">
          <el-input v-model="addForm.begintime"></el-input>
        </el-form-item>
        <el-form-item label="租房结束时间" prop="endtime">
          <el-input v-model="addForm.endtime"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addOrder">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
        title="修改房源"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="订单id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endtime">
          <el-input v-model="editForm.endtime"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editOrderInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "admin-order.vue",
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      orderData: {
        orderlist: [],
        total: 0
      },
      //控制对话框的出现与隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addForm: {
        roomid:'',
        roomname:'',
        type:'',
        begintime:'',
        endtime:''
      },
      //控制修改用户对话框的显示与隐藏
      editDialogVisible :false,
      //查询到的用户信息对象
      editForm:{
        id:'',
        roomid:'',
        address:'',
        name:'',
        long_price:'',
        short_price: '',
        type:'',
        begintime: '',
        endtime:'',
        vaild: true
      }
    }
  },
  created() {
    this.getOrderList()
  },
  methods : {
    async getOrderList() {
      //const a= await this.$http.get("getUserByAdmin/",{params:{"query":this.queryInfo.query,"pagenum":this.queryInfo.pagenum,"pagesize":this.queryInfo.pagesize}})
      const {data:res1}= await this.$http.get("order/find_all_roomorder/",{params:{"query":this.queryInfo.query,"pagenum":this.queryInfo.pagenum,"pagesize":this.queryInfo.pagesize}} )
      console.log(res1)
      if (res1.result !== 1) {
        return this.$message.error('获取订单列表失败!')
      }
      this.$message.success('获取订单列表成功!')
      this.orderData.orderlist = res1.orders
      this.orderData.total = res1.all_result_cnt

    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize) {
      //console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async orderStateChanged(orderinfo) {
      const {data:res} = await this.$http.post('order/examine_roomorder/',{"id":orderinfo.id,"vaild":orderinfo.type})
      if(res.result !== 1) {
        orderinfo.type = !orderinfo.type
        return this.$message.error('更新订单状态失败!')
      }
      this.$message.success('更新订单状态成功')
    },
    //监听注册对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，进行注册
    addOrder() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发起注册的网络请求
        /*const a = await this.$http.post("order/add_roomorder/", {
          "roomid": this.addForm.roomid,
          "name": this.addForm.roomname,
          "long or short": this.addForm.type,
          "begintime": this.addForm.begintime,
          "endtime": this.addForm.endtime
        });
        console.log(a)*/
        const {data:res1} = await this.$http.post("order/add_roomorder/", {
          "roomid": this.addForm.roomid,
          "name": this.addForm.roomname,
          "long or short": this.addForm.type,
          "begintime": this.addForm.begintime,
          "endtime": this.addForm.endtime
        });
        if (res1.result !== 1) return this.$message.error(res1.msg)
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getOrderList()
      })
    },
    async showEditDialog(id) {
      //console.log(id)
      const {data:res} =await this.$http.get('order/find_roomorder/',{params:{"id":id}})
      console.log(res)
      if(res.result !== 1) return this.$message.error(res.msg)
      this.editForm.id=id
      this.editForm.roomid = res.room_orders.roomid
      this.editForm.name = res.room_orders.name
      this.editForm.address = res.room_orders.address
      this.editForm.long_price = res.room_orders.long_price
      this.editForm.short_price = res.room_orders.short_price
      this.editForm.type = res.room_orders.type
      this.editForm.begintime = res.room_orders.begintime
      this.editForm.endtime = res.room_orders.endtime
      this.editDialogVisible = true
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editOrderInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //发起修改用户请求
        const {data: res} = await this.$http.post('order/change_roomorder/', {
          "id": this.editForm.id,
          "endtime":this.editForm.endtime
        })
        if(res.result !== 1) return this.$message.error('更新订单信息失败')
        this.editDialogVisible = false
        this.getOrderList()
        this.$message.success('更新订单信息成功')
      })
    },
    //根据Id删除对应的用户信息
    async removeOrderById(id) {
      //弹框询问管理员是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
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
      const {data:res} = await this.$http.post('order/delete_roomorder/',{"id":id})
      if(res.result !== 1) return this.$message.error('删除订单失败')
      this.$message.success('删除订单成功')
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>