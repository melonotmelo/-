<template>
<div>
    <el-card>
        <el-form :inline="true" ref="add_data" :model="search_data">
            <el-form-item label="反馈号：">
                <el-input prefix-icon="el-icon-search" v-model="search_data.search_feedbackid" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model.trim="search_data.search_status">
                    <el-option v-for="(formteam,index) in format_status_list" :key="index" 
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
            prop="feedbackid"
            label="反馈号"
            width="170">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="170">
        </el-table-column>
        <el-table-column
            prop="date"
            label="发起日期"
            width="200">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button round type="info" 
                icon="el-icon-info" size="small"
                @click="checkOperator(scope.row)">查看明细</el-button>
                <el-button round v-if="scope.row.status=='未处理'" type="success" 
                icon=el-icon-alarm-clock size="small"
                @click="press()">催办</el-button>
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
    <!--添加对话框,查看明细-->
    <el-dialog title="查看明细" :visible.sync="addDialogVisible"
    width="70%">
    <el-tabs type="border-card">
        <el-tab-pane label="我的提交">
            <el-card class="myCommit">
                <div>描述:</div>
                <el-input v-model="data4Dlg.description" placeholder="请输入内容" style="margin-top:15px"></el-input>
                <el-button round type="warning" icon=el-icon-edit size="small" @click="update()" style="margin-top:15px">修改</el-button>
            </el-card>
            <el-card class="picture">
                <div>图片: 
                    <img src="http://81.70.132.82:8000/static/media/room/2.jpg" alt="" width="50%" style="float:right">
                </div>
            </el-card>
        </el-tab-pane>
        <el-tab-pane label="管理员回复" v-if="data4Dlg.status === '已处理'">
            <el-card>{{data4Dlg.reply}}</el-card>
            <el-card class="rating" v-if="data4Dlg.status === '已处理'">
            <span class="demonstration">请为本次服务评分</span>
            <div class="block">
            <el-rate
                v-model="data4Dlg.star"
                show-text>
            </el-rate>
            <el-button class="button" type="success" icon="el-icon-check" size="small" 
            @click="submitStar(data4Dlg.feedbackid, data4Dlg.star)">确定</el-button>
            </div>
        </el-card>
        </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="addDialogVisible = false">确定</el-button>
    </span>
    </el-dialog>
</div>
</template>

<script>
import axios from 'axios'
import router from '@/router/index'
//import { data4Test } from "./model";

export default {
    name: "MyTable",
    props: {
        params: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            count: 0,
            tableData: [],
            selected_table_data: [], 
            all_table_data: [],
            //筛选条件数据
            search_data:{
                search_feedbackid:'',
                search_status:'全部'
            },
            format_status_list:['全部','已处理','未处理'],
            // 分页属性
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 0, // 1页显示多少条
                page_sizes: [1, 2, 3, 4, 6], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            addDialogVisible: false,
            data4Dlg:{
                feedbackid: 0,
                roomid: 0,
                description: '',
                date: '',
                status: '',
                reply: '',
                star: null,
            }
        }
    },
    created() { 
        this.getFeedbackList(); 
    },
    methods: {
        async getFeedbackList() {
            console.log(this.params);
            try {
                const res = await axios.get('feedback/feedbackList/', {params:{id: this.params.user_id}});
                console.log(res);
                //console.log(res);
                if(res.status !== 200) {
                    this.$message.error('获取用户反馈失败：'+ res.statusText);
                    return;
                }
                //this.tableData = res.data;
                //以下为测试，保留上面一行
                for(let item of res.data.feedback) {
                    if(item.type == this.params.type) {
                        if(item.type === 1) item.type = '投诉'
                        else item.type = '报修'
                        if(item.status == 1) item.status = '未处理'
                        else item.status = '已处理'
                        this.tableData.push(item);
                    }
                }
                console.log(this.tableData);
                //初始化分页表信息
                this.count = this.tableData.length;
                this.paginations.total = this.tableData.length;
                this.paginations.page_size = this.tableData.length;
            } catch(err) {
                //this.$message.error('发生未知错误，请重试');
                console.log(err);
            }
        },
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
        //筛选
        handleSearch() {
            if(this.all_table_data.length == 0) {
                this.all_table_data = this.tableData;
            }
            let pojo;
            this.selected_table_data = [];
            pojo = {
                feedbackid: this.search_data.search_feedbackid,  
                status: this.search_data.search_status             
            }
            for(let item of this.all_table_data) {
                if((pojo.feedbackid === '' || item.feedbackid == pojo.feedbackid) && 
                (pojo.status === "全部" || item.status === pojo.status)) {
                    this.selected_table_data.push(item);
                }
            }
            this.tableData = this.selected_table_data;
            this.paginations.total = this.tableData.length;
            this.paginations.page_size = this.tableData.length;
        },
        async checkOperator(row) {
            let feedbackid = row.feedbackid
            this.data4Dlg.feedbackid = feedbackid
            console.log(feedbackid);
            try {
                this.addDialogVisible = true
                const res = await axios.post('feedback/feedbackInfo/', {feedbackid: feedbackid});
                if(res.status !== 200) {
                    this.$message.error('获取信息失败：'+ res.statusText);
                    return;
                } 
                let data = res.data;
                this.data4Dlg = data;
                if(this.data4Dlg.status == 1) {
                    this.data4Dlg.status = '未处理'
                } else this.data4Dlg.status = '已处理'
                console.log(this.data4Dlg);
            } catch(err) {
                this.$message.error('发生未知错误，请重试' + err);
                console.log(err);
            }
            //this.data4Dlg = data4Test  
        },
        press() {
            this.$message.success('不要着急哦亲，已为您催办')
        },
        async submitStar(feedbackid, star) {
            const res = await axios.get('feedback/makePoints/', {params: {feedbackid: feedbackid, star: star}});
            console.log(res);
            if(res.status !== 200) {
                this.$message.error('上传评分失败：'+ res.statusText);
                return;
            } 
            this.$message.success("评价成功！");
        },
        async update() {
            const res = await axios.get('feedback/updateFeedback/', {
                params: {
                    id: this.params.user_id, 
                    description: this.data4Dlg.description
                }
            });
            console.log(res);
            if(res.status !== 200) {
                this.$message.error('上传修改失败：'+ res.statusText);
                return;
            } 
            this.$message.success("修改成功！");
        }
    }
}
</script>

<style>
.table-area {
    margin-top: 7px;
    background-color: rgb(245, 244, 246) !important;
    box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}

.el-pagination {
    margin-top: 15px;
}
</style>