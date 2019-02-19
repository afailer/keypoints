<template>
  <el-dialog class="con-dialog" :title="title" :visible="visible">
    <el-form ref="form" label-width="130px" class="form">
      <el-form-item label="super_category">
        <el-input v-model="super_category"></el-input>
      </el-form-item>

      <el-form-item label="name">
        <el-input v-model="name"></el-input>
      </el-form-item>

      <el-form-item label="keyPoints">
        <el-input v-model="addPointName" class="input-keypoint"></el-input>
        <el-button type="primary" icon="el-icon-plus" circle @click="addPoint"></el-button>
        <el-checkbox-group v-model="checkedPoints">
          <el-checkbox class="point-checkbox" v-for="point in keyPoints" :label="point">{{point+' '+ keyPoints.indexOf(point)}}</el-checkbox>
        </el-checkbox-group>
        <el-button type="danger" icon="el-icon-delete" circle v-show="checkedPoints.length > 0" @click="deletePoints"></el-button>
      </el-form-item>

      <el-form-item label="skeleton">
        <el-select v-model="startPoint" placeholder="请选择" class="selectPoints">
          <el-option
            v-for="item in keyPoints"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="endPoint" placeholder="请选择" class="selectPoints">
          <el-option
            v-for="item in keyPoints"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" circle @click="addSkeleton"></el-button>

        <el-checkbox-group v-model="checkedSkeletons">
          <el-checkbox class="point-checkbox" v-for="sk in skeletons" :label="sk">{{sk}}</el-checkbox>
        </el-checkbox-group>
        <el-button type="danger" icon="el-icon-delete" circle v-show="checkedSkeletons.length > 0" @click="deleteSkeletons"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">{{saveMsg}}</el-button>
        <el-button @click="cancalCategory">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {deepClone} from "../../../tool/Util";
  const SuperCategory = 'super_category';
  const Name = 'name';
  const Keypoints = 'keypoints';
  const Skeleton = 'skeleton';
  export default {
  name: 'categoryDialog',
  props: ['visible','saveCategory','create', 'tempCategory','notSaveCategory'],
  data(){
    return{
      title:'创建category',
      id:-1,
      name:'',
      super_category: '',
      addPointName: '',
      checkedPoints: [],
      keyPoints: [],
      skeletons: [],
      checkedSkeletons:[],
      startPoint: '',
      endPoint: '',
      saveMsg: ''
    }
  },
  methods: {
    addPoint(){
      if(this.addPointName.trim() !== ''){
        this.keyPoints.push(this.addPointName)
        this.addPointName = ''
      }
      console.log(this.keyPoints)
    },
    deletePoints(){
      const points = [];
      for(let l=0; l < this.keyPoints.length; l++){
        if(this.checkedPoints.indexOf(this.keyPoints[l]) === -1){
          points.push(this.keyPoints[l])
        }
      }
      this.keyPoints = points;
      this.checkedPoints = []
    },
    addSkeleton(){
      const startIndex = this.keyPoints.indexOf(this.startPoint)
      const endIndex = this.keyPoints.indexOf(this.endPoint)
      if(startIndex !== -1 && endIndex !== -1){
        this.skeletons.push([startIndex, endIndex])
      }
    },

    deleteSkeletons(){
      const skeletons = [];
      for(let l=0; l < this.skeletons.length; l++){
        if(this.checkedSkeletons.indexOf(this.skeletons[l]) === -1){
          skeletons.push(this.skeletons[l])
        }
      }
      this.skeletons = skeletons;
      this.checkedSkeletons = []
    },
    save(){
      const that = this
      const category = {
        super_category: that.super_category,
        name: that.name,
        keypoints: that.keyPoints,
        skeleton: that.skeletons
      };
      this.saveCategory(this.id, category)
    },
    cancalCategory(){
      this.notSaveCategory();
    }
  },
  watch:{
    visible(visible){
      if(visible){
        if(this.create){
          this.title = '创建category'
          this.saveMsg = '立即创建Category'
          this.id = -1;
          this.super_category ='';
          this.name = '';
          this.keyPoints = [];
          this.skeletons = [];
        }else{
          const tempCategory = deepClone(this.tempCategory)
          this.saveMsg = '立即修改Category'
          this.title = '编辑category'
          this.id = tempCategory['id'];
          this.super_category = tempCategory[SuperCategory]
          this.name = tempCategory[Name]
          this.keyPoints = tempCategory[Keypoints]
          this.skeletons = tempCategory[Skeleton]
        }
      }
    }
  }
}
</script>

<style lang="less">
  .con-dialog{
    width: 1300px;
    .input-keypoint{
      width: 100px;
    }
    .point-checkbox{
      width: 110px;
      margin-left: 0px;
    }
    .selectPoints{
      width: 150px;
    }
  }

</style>
