<template>
  <div>
    <el-form enctype="multipart/form-data">
      <img :src="url" />
      <el-form-item>
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="upload"
            multiple=""
            :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
          >
          <el-button
              style="margin-left: 10px"
              size="small"
              type="success"
              @click="submitUpload"
          >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: "test.vue",
  data() {
    return {
      name: "",
      url: "",
      id: 1,
    };
  },
  methods: {
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

      this.$http.post('user/uploadHeadshot/', fd).then((res) => {
        console.log(res.data);
      });
    },
  }
}
</script>

<style scoped>

</style>