<template>
  <div>
    <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        :file-list="fileList"
        @on-change="handleChange"
        :http-request="getFile"
    >
      <el-button size="small" type="primary">上传</el-button>
    </el-upload>
    <el-button size="small" type="success" @click="upload">确认上传</el-button>
  </div>

</template>

<script>
export default {
  name: "test",
  data(){
    return {
      file: {},
      fileList: []
    }
  },
  methods: {
    getFile(item) {
      console.log(item.file)
      this.file = item.file
    },
    async upload() {
      var fd = new FormData()
      fd.append('filename', this.file)
      const config = { headers: { 'Content-Type': 'multipart/form-data' }}
      const {data: res} = await this.$http.post('user/uploadHeadshot/', {"id": 2, "headshot": fd}
      ).then(response => {
        console.log(res);
        this.$message.success("上传成功")
      });
      console.log(res);
    },
  }
}
</script>

<style scoped>

</style>