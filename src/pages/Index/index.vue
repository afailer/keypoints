<template>
  <div class="container">
    <div>
      <div class="topbar">
        <label>拖动点色:</label><el-input type="color" class="color" v-model="highColor"></el-input>
        <label>线条色:</label><el-input type="color" class="color" v-model="commonColor"></el-input>
        <label>骨骼颜色:</label><el-input type="color" class="color" v-model="skeletonColor"></el-input>
        <el-button type="warning" round @click="drawPoint">关键点</el-button>
        <el-button type="warning" round @click="newBbox">矩形框</el-button>
        <el-button type="warning" round @click="newOutLine">多边形</el-button>
      </div>

      <el-dialog
        title="提示"
        :visible.sync="hintDialogVisible"
        width="30%">
        <span>{{hintMsg}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hintDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="hintDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <canvas ref="canvas" id="canvas" width="800px" height="800px" class="canvas">

      </canvas>
      <point-name-dialog
        :pointNameDialogVisible="pointNameDialogVisible"
        :getPointName='getPointName'
        :cancleDrawPoint="cancleDrawPoint"
        :keyPoints='category.keyPoints'>
      </point-name-dialog>
      <el-dialog title="选择图片" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="图片地址" :label-width="formLabelWidth">
            <el-input v-model="imgPath" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="drawImg">确 定</el-button>
        </div>
      </el-dialog>

      <div class="menu">
        <p class="row">
          <el-button type="primary" @click="() => {this.dialogFormVisible = true}">选择图片</el-button>
        </p>
        <ul class="itemlist">
          <li v-for="ele in this.elements" v-show="!!ele.show">
            <p>类型：<span>{{ele.type}}</span></p>
            <p>名称：<span>{{ele.name}}</span></p>
            <p>
              <i class="iconfont icon-bianji1" @click="handleEditMsg(ele)"/>
              <i class="iconfont icon-huihua1"  v-bind:class="{high: ele.edit}" @click="handleEdit(ele)"/>
              <i class="iconfont icon-shanchu" @click="handleDelete(ele)" />
            </p>
          </li>
        </ul>
        <el-pagination
          layout="prev, pager, next"
          pager-count="3"
          :page-count="3">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getPointGroup } from '@/tool/PointGroup'
  import { getRectObj } from '@/tool/RectObj'
  import { getPoint } from '@/tool/Point'
  import { getPolygon } from '@/tool/Polygon'
  import { Setting, HIGH_COLOR, COMMON_COLOR,SKELETON_COLOR } from "../../tool/Setting";
  import { getSkeletonElements } from "../../tool/Util";
  import PointNameDialog from './Dialog/pointNameDialog'
  export default {
    name: 'Test',
    components:{
      PointNameDialog
    },
    mounted(){
      this.init(this.$refs.canvas.getContext('2d'));
      const highColor = String(localStorage.getItem('highColor'));
      const commonColor = String(localStorage.getItem('commonColor'));
      const skeletonColor = String(localStorage.getItem('skeletonColor'));
      if(highColor !== 'null' && highColor !== 'undefined'){
        this.highColor = highColor
      }else{
        localStorage.setItem(HIGH_COLOR, this.highColor)
      }
      if(commonColor !== 'null' && commonColor !== 'undefined'){
        this.commonColor = commonColor
      }else{
        localStorage.setItem(COMMON_COLOR, this.commonColor)
      }
      if(skeletonColor !== 'null' && skeletonColor !== 'undefined'){
        this.skeletonColor = skeletonColor
      }else{
        localStorage.setItem(SKELETON_COLOR, this.skeletonColor)
      }
      Setting.prototype[HIGH_COLOR] = this.highColor;
      Setting.prototype[COMMON_COLOR] = this.commonColor;
      Setting.prototype[SKELETON_COLOR] = this.skeletonColor;
      this.$store.dispatch('saveCurrentKeyPoints', this.category.keyPoints)
    },
    methods:{
      init(pen) {
        const main_loop = () => {
          pen.clearRect(0, 0, 9999, 9999);

          for (let l = 0; l < this.elements.length; l++) {
            this.elements[l].draw(pen);
          }
          console.log(this.skeletonElements.length);
          for (let s = 0; s < this.skeletonElements.length; s++){
            this.skeletonElements[s].draw(pen)
          }
          requestAnimationFrame(main_loop);
        };
        main_loop();
      },
      drawImg(){
        this.dialogFormVisible = false;
        const img = new Image();
        img.src = this.imgPath;
        img.onload = () => {
          this.elements.unshift({
            draw: (pen) => {
              pen.drawImage(img, 0, 0)
            },
            show: false
          })
        };
      },
      handleEdit(ele) {
        ele.editElement();
      },
      drawPoint() {
        if(this.$store.getters.keyPointsLeftName.length === 0){
          this.hintDialogVisible = true;
          this.hintMsg = '已标注完毕当前所选区域的所有关键点';
          return
        }
        if(this.tempPoint.finish === false){
          this.hintMsg = '当前有存在未标记的点';
          this.hintDialogVisible = true;
          return
        }
        this.tempPoint = getPoint();
        this.elements.push(this.tempPoint);
        this.pointNameDialogVisible = true
      },
      cancleDrawPoint(){
        this.elements.splice(this.elements.indexOf(this.tempPoint),1);
        this.tempPoint.editElement(true)
        this.pointNameDialogVisible = false
      },
      newBbox() {
        this.currentBboxId = parseInt(Math.random() * 10000000000000);
        this.$store.dispatch('addNewBboxId', this.currentBboxId);
        this.elements.splice(1,0,getRectObj(this.currentBboxId))
      },
      newOutLine() {
        this.elements.push(getPolygon())
      },
      handleDelete(e) {
        e.editElement(true);
        let index = this.elements.indexOf(e);
        this.elements.splice(index, 1);
        if(this.category.keyPoints.indexOf(e.name) !== -1){
          this.$store.dispatch('reselectKeypoint', e.name)
        }
        this.skeletonElements = getSkeletonElements(this.elements, this.category.skeleton, this.category.keyPoints)
      },
      handleEditMsg(e){
        this.$store.dispatch('reselectKeypoint', e.name);
        this.tempPoint = e;
        this.pointNameDialogVisible = true
      },
      getPointName(name){
        this.tempPoint.name = name;
        this.pointNameDialogVisible = false;
        this.skeletonElements = getSkeletonElements(this.elements, this.category.skeleton, this.category.keyPoints)
      }
    },
    data () {
      return {
        hintDialogVisible:false, // 点击添加关键点后，如果不能再添加，则弹出提示框
        hintMsg: '', // 不能继续添加关键点的提示语
        pointNameDialogVisible: false, // 选择关键点名称的dialog
        dialogMsgVisible: false, //备注
        imgPath: 'http://dingyue.nosdn.127.net/a24zKdxzcOZwdLglgmBCa3pUYIttr86UKkDB6z=h4TyUo1541130069984.jpg',
        dialogFormVisible: false, //图片地址选择框
        formLabelWidth: '100px', // 图片地址和编辑备注dialog的宽度
        tempPoint: {}, //添加点时候数组中的最后一个点
        elements: [], // 所有的元素
        skeletonElements: [], // 骨骼的元素集合
        highColor: '#FFA54F', // 初始高亮点颜色
        commonColor: '#FFFFFF', // 初始普通线条颜色
        skeletonColor: '#FF0000', // 初始骨骼颜色
        currentBboxId: -1,
        category: {
            supercategory: "person",
            id: 1,
            name: "person",
            keyPoints: ["nose","left_eye","right_eye","left_ear","right_ear","left_shoulder","right_shoulder","left_elbow","right_elbow","left_wrist","right_wrist","left_hip","right_hip","left_knee","right_knee","left_ankle","right_ankle"],
            skeleton: [[16,14],[14,12],[17,15],[15,13],[12,13],[6,12],[7,13],[6,7],[6,8],[7,9],[8,10],[9,11],[2,3],[1,2],[1,3],[2,4],[3,5],[4,6],[5,7]]
          }

      }
    },
    watch:{
      highColor: (newVal) => {
        localStorage.setItem(HIGH_COLOR, newVal)
        Setting.prototype[HIGH_COLOR] = newVal
      },
      commonColor: (newVal) => {
        localStorage.setItem(COMMON_COLOR, newVal)
        Setting.prototype[COMMON_COLOR] = newVal
      },
      skeletonColor: (newVal) => {
        localStorage.setItem(SKELETON_COLOR, newVal)
        Setting.prototype[SKELETON_COLOR] = newVal
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "index.less";
</style>
