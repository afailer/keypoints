<template>
  <el-dialog class="con-dialog" :title="title" :visible.sync="visible">
    <el-form ref="form" label-width="100px" class="form">
      <el-form-item>
        <el-upload
          :file-list="fileList"
          ref="upload"
          action=""
          :auto-upload="false"
          :multiple="false"
          :limit="1"
          :http-request="loadSrc"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {deepClone} from "../../../tool/Util";
  import {uploadImgs} from "../../../api/BatchApi";

  export default {
    name: 'UploadBatchDialog',
    data(){
      return{
        title: '上传压缩包',
        fileList:[],
        id: -1,
        visible: false
      }
    },
    created () {
      this.$bus.$on('uploadImg',(batch) => {
        this.id = batch['id'];
        this.visible = true
      })
    },
    methods:{
      submitUpload(){
        this.$refs.upload.submit();
      },
      loadSrc(file){
        const formData = new FormData();
        formData.append('file',file.file);
        uploadImgs(this.id, formData).then(res => {
          this.$message.success(res.data.message)
          this.visible = false
        })
      }
    }
  }
</script>

<style lang="less">
  .con-dialog{
    width: 1300px;
  }
</style>
