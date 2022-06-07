<template>
  <Menu>
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href=".#/center">订单中心</a></el-breadcrumb-item>
    <el-breadcrumb-item>投诉</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row class="input-area">
            <el-col :span="10">
                <el-input placeholder="请输入房间号" v-model="input" clearable>
                </el-input>
            </el-col>
        </el-row>
        <el-row class="text-area">
            <el-col :span="20">
                <el-input type="textarea" :rows="4" placeholder="请输入内容..." v-model="textarea"></el-input>
            </el-col>
        </el-row>
        <el-row class="suggestion-area">
            <el-col :span="20">
                <el-input type="textarea" :rows="4" placeholder="提点建议..." v-model="suggest"></el-input>
            </el-col>
        </el-row>
        <el-row class="picture-area">
          <el-col :span='6'>
              <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :http-request="httpRequest"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                list-type="picture"
                :limit="3">
                <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                <div slot="tip" class="el-upload__tip">最多3张图片，且每张不超过2M</div>
              </el-upload>
          </el-col>
      </el-row>
      <el-button type="info" size="small" @click="submitImportForm">提交</el-button>
    </el-card>
  </Menu>
</template>

<script>
import Menu from '../components/Menu'
import axios from 'axios';
export default {
    name: "Complaint",
    components: {
        Menu,
    },
    data() {
        return {
            input: '', // 房间号
            textarea: '', // 上报信息
            suggest: '', // 意见
            fileList: [],
        };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      httpRequest(option) {
        this.fileList.push(option)
      },
      // 上传前处理
      beforeUpload(file) {
        if(this.input == '') {
          this.$message("房间号不能为空")
          return false;
        }
        else if(this.textarea == '') {
          this.$message("输入内容不能为空");
          return false;
        }
        let fileSize = file.size
        const TWO_M= 2*1024*1024;
        //大于5M，不允许上传
        if(fileSize>TWO_M){
          this.$message.error("最大上传2M")
          return false
        }
        // //判断文件类型，必须是jpg格式
        // let fileName = file.name
        // let reg = /^.+(\.jpj)$/
        // if(!reg.test(fileName)){
        //   this.$message.error("只能上传jpg!")
        //   return false
        // }
        return true
      },
      // 文件数量过多时提醒
      handleExceed() {
        this.$message({ type: 'error', message: '最多支持3张图片上传' })
      },

      submitImportForm() {
        console.log(this.fileList[0].file)
        // 使用form表单的数据格式
        const paramsData = new FormData()
        // 将上传文件数组依次添加到参数paramsData中
        paramsData.append('id', 1); //用户id
        let i = 1;
        this.fileList.forEach((x) => {
          if(i == 1) paramsData.append('img1', x.file);
          else if(i == 2) paramsData.append('img2', x.file);
          else appendData.append('img3', x.file);
          i++;
        });
        paramsData.append('type', 1);
        paramsData.append('roomId', this.input);
        paramsData.append('description', this.textarea + this.suggest);
		
        axios.post('feedback/createFeedback/', paramsData).then(res => {
          console.log(res.data);
        })
        this.$message.success("提交成功！")
      },
      post_repair() {
        if(this.input == '') {
          this.$message("房间号不能为空")
          return;
        }
        else if(this.textarea == '') {
          this.$message("输入内容不能为空");
          return;
        }
        else {
          this.submmit_content();
        }
      }
    }
}
</script>

<style scoped>
.el-breadcrumb {
    margin-bottom: 15px;
}
.el-card {
    box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
.input-area {
    margin-bottom: 15px;
}
.text-area {
    margin-bottom: 15px;
}
.suggestion-area {
    margin-bottom: 15px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 40px;
    height: 40px;
    display: block;
  }

.picture-area {
  margin-bottom: 25px;
}

.el-upload__tip {
  color: grey !important;
  font-size: 8px !important;
}
</style>