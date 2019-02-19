<template>
  <el-dialog
    title="请选bbox的名称"
    :visible.sync="visible"
    width="30%"
  >
    <el-select v-model="selectCategory" placeholder="请选择">
      <el-option
        v-for="item in categories"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取 消</el-button>
      <el-button type="primary" @click='handleSave'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getCategoryDetailById} from "../../../api/categoryApi";

  export default {
    name: 'bboxNameDialog',
    props:['choseCategory'],
    data() {
      return{
        visible: false,
        categories: [],
        selectCategory: ''
      }
    },
    created(){
      this.$bus.$on('bboxName',(data) => {
        this.categories = data;
        this.visible = true
      })
    },
    methods: {
      handleCancle(){
        this.selectCategory = '';
        this.visible = false
      },
      handleSave(){
        let that = this
        getCategoryDetailById(this.selectCategory).then(res => {
          that.visible = false
          that.choseCategory(res.data);
        })
      }
    }
  }
</script>

<style>

</style>
