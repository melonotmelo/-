<template>
  <div>
    <el-button @click="downloadExcel('http://81.70.132.82:8000/static/doc/contract.docx')">xiazai</el-button>

  </div>

</template>

<script>
export default {
  name: "test",
  data() {
    return {
      name: "",
      url: "",
      id: 1,
    };
  },
  methods: {
    downloadExcel(url) {
      window.open(url, '_self');
}
  },
}
</script>

<style scoped>

</style>