<template>
  <Menu>
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/room' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单中心</el-breadcrumb-item>
    </el-breadcrumb>
     <el-card class="body">
        <el-card>
            <el-form :inline="true" ref="add_data" :model="search_data">
                <el-form-item label="房间号：">
                    <el-input prefix-icon="el-icon-search" v-model="search_data.search_room_id" clearable></el-input>
                </el-form-item>
                <el-form-item label="类型：">
                    <el-select v-model.trim="search_data.search_type">
                        <el-option v-for="(formteam,index) in format_type_list" :key="index" 
                        :label="formteam" :value="formteam"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model.trim="search_data.search_valid">
                        <el-option v-for="(formteam,index) in format_valid_list" :key="index" 
                        :label="formteam" :value="formteam"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="btnSearch">
                    <el-button type="primary " size="small" icon="el-icon-search" @click="handleSearch()">筛选</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="table-area">
            <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column 
            type="index"
            label="#">
            </el-table-column>
            <el-table-column
                prop="id"
                label="订单号"
                width="90">
            </el-table-column>
            <el-table-column
                prop="room_id"
                label="房间号"
                width="90">
            </el-table-column>
            <el-table-column
                prop="type"
                label="类型"
                width="110">
            </el-table-column>
            <el-table-column
                prop="valid"
                label="状态"
                width="140">
            </el-table-column>
            <el-table-column
                prop="begintime"
                label="起始日期"
                width="140">
            </el-table-column>
            <el-table-column
                prop="endtime"
                label="截止日期"
                width="140">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" 
                    icon="el-icon-edit" size="small"
                    @click="handleOperator(scope.row)">续约</el-button>
                    <el-button type="info" 
                    icon="el-icon-info" size="small"
                    @click="checkRoom(scope.row)">房间信息</el-button>
                </template>
            </el-table-column>
            </el-table>
            <!--分页区-->
            <el-pagination
                :page-sizes="paginations.page_sizes"
                :page-size="paginations.page_size"
                :layout="paginations.layout"
                :total="paginations.total"
                :current-page.sync='paginations.page_index'
                @current-change='handleCurrentChange'
                @size-change='handleSizeChange'>
            </el-pagination>
        </el-card>
        <!--添加续约对话框-->
        <el-dialog title="添加续约" :visible.sync="addDialogVisible"
        width="60%" @close="addDialogClosed">
        <el-form :model="renewalForm" :rules="renewalFormRules" ref="renewalFormRef" 
        label-width="70px">
            <el-form-item label="订单号" prop="id">
                <el-col :span="15">
                    <el-form-item prop="renewalForm.id">
                        <el-input v-model="renewalForm.id"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="新期限" prop="endtime">
            <el-col :span="17">
                <el-form-item prop="renewalForm.endtime">
                    <el-date-picker type="date" placeholder="选择日期" v-model="renewalForm.endtime" style="width: 70%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
            </el-col>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="extent_rent" size="small">确定</el-button>
        </span>
        </el-dialog>
    </el-card>
  </Menu>
</template>

<script>
import Menu from '../components/Menu'
import axios from 'axios'
//import router from '@/router/index'
//axios.defaults.baseURL='http://localhost:3000/';//设置基址
//axios.defaults.baseURL='81.70.132.82:8000'

export default {
    name: "Center",
    components: {
        Menu,
    },
    data() {
        return {
            orderList: [],
            count: 0,

            tableData: [],
            selected_table_data: [], 
            all_table_data: [],
            //筛选条件数据
            search_data:{
                search_room_id:'',
                search_type:'全部',
                search_valid:'全部'
            },
            format_type_list:['全部','长租','短租'],
            format_valid_list:['全部','已缴费','未缴费'],
            // 分页属性
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 0, // 1页显示多少条
                page_sizes: [1, 2, 3, 4, 6], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            //对话框属性，隐藏对话框
            addDialogVisible: false,
            // 添加续约信息的表单数据
            renewalForm: {
                id: '',
                endtime: '',
            },
            // 添加表单的验证规则对象
            renewalFormRules: {
                id: [
                    {required: true, message: '请输入订单号', trigger: 'blur'},
                ],
                endtime: [
                    {required: true, message: '请选择日期', trigger: 'blur'},
                ],
            },
        }
    },
    created() { //在创建vue对象时，当html渲染之前就触发；但是注意，只会触发一次
        this.getOrderList(); 
    },
    methods: {
        handleCurrentChange(page) {
            if(this.all_table_data.length == 0) {
                this.all_table_data = this.tableData;
            }
            // 当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.all_table_data.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.tableData = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        handleSizeChange(page_size) {
            if(this.all_table_data.length == 0) {
                this.all_table_data = this.tableData;
            }
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.tableData = this.all_table_data.filter((item, index) => {
                return index < page_size;
            });
         },
        setPaginations() {
            if(this.all_table_data.length == 0) {
                this.all_table_data = this.tableData;
            }
            // 总页数
            this.paginations.total = this.all_table_data.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 5;
            // 设置默认分页数据
            this.tableData = this.all_table_data.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 获取订单信息
        async getOrderList() {
            try {
                const res = await axios.get('order/get_roomorder_by_userid/', {
                    params: {
                        user_id: 2,
                    }
                });
                //console.log(res);
                if(res.status !== 200) {
                    this.$message.error('获取用户订单失败：'+ res.statusText);
                    return;
                }
                this.tableData = res.data.orders;
                for(let i = 0; i < this.tableData.length; i++) {
                    if(this.tableData[i].type === 'long') {
                        this.tableData[i].type = '长租'
                    } else {
                        this.tableData[i].type = '短租'
                    }
                    if(this.tableData[i].valid == false) {
                        this.tableData[i].valid = '已缴费'
                    } else {
                        this.tableData[i].type = '未缴费'
                    }
                }
                console.log(this.tableData);
                this.count = res.data.cnt;
                //初始化分页表信息
                this.paginations.total = this.tableData.length;
                this.paginations.page_size = this.tableData.length;
            } catch(err) {
                //this.$message.error('发生未知错误，请重试');
                console.log(err);
            }
        },

        //筛选
        handleSearch() {
            if(this.all_table_data.length == 0) {
                this.all_table_data = this.tableData;
            }
            let pojo;
            this.selected_table_data = [];
            pojo = {
                room_id: this.search_data.search_room_id,  
                type: this.search_data.search_type,
                valid: this.search_data.search_valid
            }
            for(let item of this.all_table_data) {
                if((pojo.room_id === '' || item.room_id == pojo.room_id) && 
                (pojo.type === "全部" || item.type === pojo.type) && 
                (pojo.valid === '全部') || item.valid === pojo.valid) {
                    this.selected_table_data.push(item);
                }
            }
            this.tableData = this.selected_table_data;
            this.paginations.total = this.tableData.length;
            this.paginations.page_size = this.tableData.length;
        },
        // 续约条件
        handleOperator(row){
            //console.log(row)
            if (row.valid === '已缴费') {
                this.addDialogVisible = true
            }
            else {
                this.$message.error('请先租房')
            }
        },
        // 点击查看房间详细信息(自动跳转到房间页面，同时传递参数: room_id)
        async checkRoom(row) {
            this.$router.push({
                name: "houseInfo", 
                params: {room_id: row.room_id}
            });
        },

        // 监听对话框的关闭事件
        addDialogClosed() {
            // 重置表单
            this.$refs.renewalFormRef.resetFields();
        },
        // 点击按钮续约 
        extent_rent() {
            console.log(this.renewalForm);
            this.$refs.renewalFormRef.validate(async valid=>{
                //console.log(valid);
                if(!valid) return;
                //可以发起续约请求(修改单个订单，参数：订单号（用于查询），期限（用于修改）)
                //续约完成后，状态应变为未缴费，这应该由后端处理
                try {
                    const res = await axios.post('order/change_roomorder/', {
                            "id": this.renewalForm.id,
                            "endtime": this.renewalForm.endtime
                        });
                    if(res.status !== 200) {
                        this.$message.error('订单号不存在：' + res.statusText);
                    } 
                    else if(res.data.result == 0) {
                        this.$message.error('无此租约');
                    }
                    else {
                        this.$message.success('续约成功!');
                        //重新获得订单表
                        this.getOrderList(); 
                    }
                } catch(err) {
                    this.$message.error('发生未知错误，请重试');
                    console.log(err);
                }
                this.addDialogVisible = false;
            });
        }
    },
}
</script>

<style scoped>
.el-breadcrumb {
    margin-bottom: 15px;
}

.table-area {
    margin-top: 7px;
    background-color: rgb(245, 244, 246) !important;
    box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}

.el-pagination {
    margin-top: 15px;
}
</style>