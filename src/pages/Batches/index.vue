<template>
  <div class="con">
    <batch-dialog
      :visible="batchDialogVisible"
      :create="create"
      :batch="tempBatch"
      :cancleSave="cancleSave"
      :saveBatch="saveBatch"
    ></batch-dialog>
    <upload-batch-dialog
      :visible="uploadDialogVisible"
      :batch="tempBatch"
    >
    </upload-batch-dialog>
    <el-button type="primary" @click="createBatch">创建批次</el-button>
    <el-table :data="batches" border class="table">
      <el-table-column label="id" width="50">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="批次名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="url" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column label="版本" width="80">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.version }}</span>
        </template>
      </el-table-column>

      <el-table-column label="批次描述" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label="种类" width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.categories }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="batchDetailInfo(scope.row)">详情</el-button>
          <el-button type="primary" size="mini" @click="editBatch(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="uploadZip(scope.row)">上传压缩包</el-button>
          <el-button type="warning" size="mini" @click="goEdit(scope.row)">进入标注</el-button>
          <el-button type="primary" size="mini" @click="goDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getBatches, postBatches, patchBatches} from "../../api/BatchApi";
  import {getCategory} from "../../api/categoryApi";
  import BatchDialog from './BatchDialog'
  import UploadBatchDialog from './UploadBatchDialog'

  export default {
    name: 'Batch',
    data(){
      return{
        batchDialogVisible:false,
        uploadDialogVisible: false,
        create: false,
        tempBatch:{},
        batches:[]
      }
    },
    components:{
      BatchDialog,
      UploadBatchDialog
    },
    mounted(){
      getCategory().then(res => {
        this.$store.dispatch('saveCategories', res.data.results)
      });
      this.getBatchDatas();
    },
    methods:{
      getBatchDatas(){
        getBatches().then(res => {
          this.batches = res.data.results
        })
      },
      createBatch(){
        this.create = true;
        this.tempBatch = {};
        this.batchDialogVisible = true
      },
      saveBatch(id, batch){
        this.batchDialogVisible = false;
        console.log(id)
        if(id === -1){
          postBatches(batch).then(res => {
            this.getBatchDatas();
          })
        }else{
          patchBatches(id, batch).then(res => {
            this.getBatchDatas();
          })
        }
      },
      cancleSave(){
        this.batchDialogVisible = false
      },
      editBatch(batch){
        this.create = false;
        this.tempBatch = batch;
        this.batchDialogVisible = true
      },
      uploadZip(batch){
        this.tempBatch = batch
        this.$bus.$emit('uploadImg', batch)
      },
      goEdit(batch){
        this.$router.push({
          path: `/drawTools/${batch.id}`,
        })
      },
      batchDetailInfo(batch){

      },
      goDownload(batch){
        window.location.href = `http://10.18.117.14:8888/api/v1/label/batchs/${batch.id}/export/`
      }
    }
  }
</script>

<style lang="less">
  .con{
    width: 1150px;
    margin: 0px auto;
    padding: 30px;
    .table{
      margin-top: 20px;
    }
  }
</style>
