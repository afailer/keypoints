<template>
  <div class="con">
    <el-button type="primary" @click="createCategory">创建类别</el-button>
    <create-category-dialog
      :visible="categoryDialogVisible"
      :create="create"
      :saveCategory="saveCategory"
      :tempCategory="tempCategory"
      :notSaveCategory="notSaveCategory"
    ></create-category-dialog>

    <el-table :data="category" border class="table">
      <el-table-column label="超类名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.super_category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关键点" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.keypoints.join(',')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="骨骼信息" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.skeleton}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editCategory(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import CreateCategoryDialog from './CreateCategoryDialog'
  import { postCategory, patchCategory, getCategory } from "../../api/categoryApi";

  export default {
  name: 'category',
  components: {
    CreateCategoryDialog
  },
  data(){
    return{
      create: false,
      categoryDialogVisible: false,
      category: [],
      tempCategory: {}
    }
  },
  mounted(){
    this.loadAllCategory()
  },
  methods: {
    createCategory(){
      this.categoryDialogVisible = true;
      this.create = true
    },
    loadAllCategory(){
      getCategory().then(res => {
        this.category = res.data.results
      })
    },
    saveCategory(id, category){
      if(id === -1){
        postCategory(category).then(res => {
          console.log(res)
          this.loadAllCategory()
        });
      }else{
        patchCategory(id,category).then(res => {
          console.log(res)
          this.loadAllCategory()
        })
      }
      this.categoryDialogVisible = false
    },
    notSaveCategory(){
      this.tempCategory = {}
      this.create = false
      this.categoryDialogVisible = false
    },
    editCategory(category){
      this.tempCategory = category
      this.create = false
      this.categoryDialogVisible = true
    }
  }
}
</script>

<style lang="less">
  .con{
    width: 900px;
    margin: 0px auto;
    padding: 30px;
    .table{
      margin-top: 20px;
    }
  }
</style>
