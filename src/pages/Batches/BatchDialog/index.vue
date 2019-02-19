<template>
  <el-dialog class="con-dialog" :title="title" :visible="visible">
    <el-form ref="form" label-width="100px" class="form">
      <el-form-item label="批次名称">
        <el-input v-model="name"></el-input>
      </el-form-item>

      <el-form-item label="url">
        <el-input v-model="url"></el-input>
      </el-form-item>

      <el-form-item label="版本">
        <el-input v-model="version"></el-input>
      </el-form-item>

      <el-form-item label="批次描述">
        <el-input v-model="description"></el-input>
      </el-form-item>

      <el-form-item label="类别">
        <el-select
          v-model="selectCategories"
          placeholder="请选择"
          class="selectPoints"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in this.$store.getters.allCategories"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">{{saveMsg}}</el-button>
        <el-button @click="cancleSave">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {deepClone} from "../../../tool/Util";

  export default {
    name: 'batchDialog',
    props: ['visible','saveBatch','batch','create','cancleSave'],
    data(){
      return{
        title:'',
        id:-1,
        name:'',
        url:'',
        version:'',
        description:'',
        selectCategories: [],
        saveMsg:'保存'
      }
    },
    mounted(){

    },
    methods:{
      save(){
        this.saveBatch(this.id, {
          name: this.name,
          description: this.description,
          version: this.version,
          url: this.url,
          categories: this.selectCategories
        })
      }
    },
    watch:{
      visible(visible){
        console.log(this.batch);
        console.log(this.batch['categories']);
        if(visible){
          if(this.create){
            this.title = '创建批次'
            this.saveMsg = '立即创建批次'
            this.id = -1;
            this.url = '';
            this.description ='';
            this.name = '';
            this.version = '';
            this.selectCategories = []
          }else{
            const batch = deepClone(this.batch);
            this.saveMsg = '立即修改批次';
            this.title = '编辑批次';
            this.id = batch['id'];
            this.url = batch['url'];
            this.name = batch['name'];
            this.version = batch['version'];
            this.description = batch['description'];
            this.selectCategories = batch['categories'] || []
          }
        }
      }
    }
  }
</script>

<style>
  .con-dialog {
    width: 1300px;
  }
</style>
