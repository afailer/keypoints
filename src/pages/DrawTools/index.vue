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
        <el-button type="primary" @click="prevPage" :disabled="currentPage <= 1">上一张</el-button>
        <el-button type="primary" @click="nextPage" :disabled="currentPage >= totalPage">下一张</el-button>
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
      <el-pagination
        layout="prev, pager, next"
        :page-count=this.totalPage
        :current-page='currentPage'
        @current-change = "handleImgPageChange"
      >
      </el-pagination>
      <point-name-dialog
        :pointNameDialogVisible="pointNameDialogVisible"
        :getPointName='getPointName'
        :cancleDrawPoint="cancleDrawPoint"
        :keyPoints='category.keypoints'>
      </point-name-dialog>
      <bbox-dialog
        :choseCategory="choseCategory"
      >
      </bbox-dialog>
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
          <li v-for="ele in this.elements" v-show='showItem(ele)'>
            <p>类型：<span>{{ele.type}}</span></p>
            <p>名称：<span>{{ele.name}}</span></p>
            <p>{{currentBboxId}}'--' {{ele.bboxId}}</p>
            <p>
              <i class="iconfont icon-bianji1" @click="handleEditMsg(ele)"/>
              <i class="iconfont icon-huihua1"  v-bind:class="{high: ele.edit}" @click="handleEdit(ele)"/>
              <i class="iconfont icon-shanchu" @click="handleDelete(ele)" />
            </p>
          </li>
        </ul>
        <el-pagination
          layout="prev, pager, next"
          :page-count=this.$store.getters.bboxIds.length
          :current-page='currentBboxPage'

          @current-change = "handleChangeBbox"
        >
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
  import { getSkeletonElements, getCurrentKeyPointsLeft } from "../../tool/Util";
  import PointNameDialog from './Dialog/pointNameDialog'
  import BboxDialog from './BboxDialog'
  import { getImageInfoByBatchId, getCurrentBatchInfo } from "../../api/BatchApi";
  import { getAnnotations } from "../../Utils/SaveAnnotations";
  import { getElements, getBBoxIds } from "../../Utils/getElementsFromAnnotation";
  import {saveImageAnnotations, getCurrentImgInfo} from "../../api/imagesApi";
  import {getCategoryDetailById} from "../../api/categoryApi";
  import {getNum, getCategoryIdFromElements} from "../../tool/Util";

  export default {
    name: 'Test',
    components:{
      PointNameDialog,
      BboxDialog
    },
    mounted(){
      console.log(document.body.clientHeight)
      window.onresize = () => {
        this.$refs.canvas.width = (document.body.clientWidth - 300)
        this.$refs.canvas.height = (document.body.clientHeight - 150)
      }
      this.$refs.canvas.width = (document.body.clientWidth - 300)
      this.$refs.canvas.height = (document.body.clientHeight - 150)
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
      this.batchId = this.$route.params['batchId'];
      this.loadCurrentBatchInfo();
    },
    methods:{
      init(pen) {
        const main_loop = () => {
          pen.clearRect(0, 0, 9999, 9999);
          for (let l = 0; l < this.elements.length; l++) {
            if(l === 0 || this.elements[l].bboxId === this.currentBboxId){
              this.elements[l].draw(pen);
            }

          }
          for (let s = 0; s < this.skeletonElements.length; s++){
            this.skeletonElements[s].draw(pen)
          }
          requestAnimationFrame(main_loop);
        };
        main_loop();
      },
      loadNextImg(){
        this.initImgData();
        getImageInfoByBatchId(this.batchId).then(res => {
          console.log(res)
          if(res.data.results.length > 0){
            this.imgList = res.data.results;
            this.imgPath = res.data.results[0]['file_url'];
            this.drawImg()
          }else{
            this.$message.error('请上传图片')
          }
        })
      },
      initImgData(){
        this.elements.length = 0;
        this.skeletonElements.length = 0;
        this.categories.length = 0;
        this.imgId = -1;
        this.category = {};
        this.currentBboxId = -1;
        this.currentBboxPage = 1;
        this.$store.dispatch('deletePointsAndBbox', {})
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
      showItem(ele){
        return ele.bboxId === this.currentBboxId
      },
      handleEdit(ele) {
        ele.editElement();
      },
      drawPoint() {
        if(this.currentBboxId === -1){
          this.hintMsg = '请先绘制bbox';
          this.hintDialogVisible = true;
          return
        }
        if(this.tempPoint.finish === false){
          this.hintMsg = '当前有存在未标记的点';
          this.hintDialogVisible = true;
          return
        }
        if(this.$store.getters.keyPointsLeftName.length === 0){
          this.hintDialogVisible = true;
          this.hintMsg = '已标注完毕当前所选区域的所有关键点';
          return
        }
        this.tempPoint = getPoint(this.currentBboxId, this.category.id).build();
        this.elements.push(this.tempPoint);
        this.pointNameDialogVisible = true
      },
      cancleDrawPoint(){
        this.elements.splice(this.elements.indexOf(this.tempPoint),1);
        this.tempPoint.editElement(false)
        this.pointNameDialogVisible = false
      },
      newBbox() {
        this.$bus.$emit('bboxName',this.currentBatchInfo.categories)
      },
      newOutLine() {
        if(this.currentBboxId < 0){
          this.hintMsg = '请先绘制bbox';
          this.hintDialogVisible = true;
          return
        }
        this.elements.push(getPolygon(this.currentBboxId, this.category.id).build())
      },
      handleDelete(e) {
        e.editElement(false);
        let index = this.elements.indexOf(e);
        this.elements.splice(index, 1);
        if(this.category.keypoints.indexOf(e.name) !== -1){
          this.$store.dispatch('reselectKeypoint', e.name)
        }
        if(e.typeCode === 'bbox'){
          this.handleDeleteCurrentBbox()
        }
        this.skeletonElements = getSkeletonElements(this.currentBboxId, this.elements, this.category.skeleton, this.category.keypoints)
      },
      handleDeleteCurrentBbox(){
        this.elements = this.elements.filter(e => {
          return e.bboxId !== this.currentBboxId
        });
        this.$store.dispatch('deleteBboxId', this.currentBboxId)
        this.currentBboxId = this.$store.getters.bboxIds[0];
        this.currentBboxPage = 1
      },
      handleEditMsg(e){
        this.$store.dispatch('reselectKeypoint', e.name);
        this.tempPoint = e;
        this.pointNameDialogVisible = true
      },
      getPointName(name, visible){
        this.tempPoint.name = name;
        this.tempPoint.point.v = visible;
        this.pointNameDialogVisible = false;
        this.skeletonElements = getSkeletonElements(this.currentBboxId, this.elements, this.category.skeleton, this.category.keypoints)
      },
      async handleChangeBbox(currentNum){
        this.currentBboxId = this.$store.getters.bboxIds[currentNum -1];
        const categoryId = getCategoryIdFromElements(this.elements, this.currentBboxId)
        const res =await getCategoryDetailById(categoryId);
        this.category = res.data;
        this.handleChangeLeftCategory();
        this.currentBboxPage = currentNum
        this.elements.forEach(e => {
            e.editElement && e.editElement(e.bboxId === this.currentBboxId)
        })
      },
      handleChangeLeftCategory(){
        console.log(this.currentBatchInfo)
        const currentKeypointsLeft = getCurrentKeyPointsLeft(this.currentBboxId, this.elements,this.category.keypoints)
        this.$store.dispatch('saveCurrentKeyPoints', currentKeypointsLeft);
      },
      loadCurrentBatchInfo(){
        getCurrentBatchInfo(this.batchId).then(res => {
          this.currentBatchInfo = res.data;
          this.currentPage = this.currentBatchInfo.image_count.label;
          this.totalPage = this.currentBatchInfo.image_count.total;
          if(this.totalPage < 1){
            this.$message.error('请上传图片')
          }
          if(this.currentBatchInfo.categories.length === 0){
            this.$alert(`第${this.batchId}批次缺少category`, '请在批次管理为当前批次添加category', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push({path: '/batches/'})
              }
            });
          }else{
            this.loadImgByCurrentPageNo()
          }
        })
      },
      choseCategory(category) {
        this.category = category;
        this.$store.dispatch('saveCurrentKeyPoints', this.category.keypoints)

        this.currentBboxId = getNum();
        this.$store.dispatch('addNewBboxId', this.currentBboxId);
        this.elements.splice(1,0,getRectObj(this.currentBboxId,this.category.name, this.category.id).build());

        const currentKeypointsLeft = getCurrentKeyPointsLeft(this.currentBboxId, this.elements,this.category.keypoints);
        this.$store.dispatch('saveCurrentKeyPoints', currentKeypointsLeft);
        this.currentBboxPage = this.$store.getters.bboxIds.indexOf(this.currentBboxId)+1;
        this.elements.forEach(e => {
          if(e.bboxId !== this.currentBboxId){
            e.editElement && e.editElement(false)
          }
        })
      },
      async saveCurrentAnnotations(){
        if(this.$store.getters.bboxIds.length > 0){
          const currentAnnotations = await getAnnotations(this.elements,this.$store.getters.bboxIds)
          await saveImageAnnotations(this.imgId, currentAnnotations)
        }
      },
      async prevPage(){
        if(this.currentPage <= 1){
          this.$message.warning('已经是第一页')
        }else{
          this.currentPage--;
          this.loadImgByCurrentPageNo()
        }
      },
      async nextPage(){
        if(this.currentPage >= this.totalPage){
          this.$message.warning('已经到最后一页')
        }else{
          this.currentPage++;
          this.loadImgByCurrentPageNo();
        }
      },
      async loadImgByCurrentPageNo(){
        await this.saveCurrentAnnotations();
        this.initImgData();
        getCurrentImgInfo(this.batchId, this.currentPage).then(async (res) => {
          this.elements.length = 0;
          const imgInfo = res.data.results[0];
          console.log(imgInfo)
          this.imgPath = imgInfo.file_url;
          this.imgId = imgInfo.id;
          this.drawImg();
          const eles = await getElements(imgInfo.annotations, this.currentBatchInfo);
          this.elements = [...this.elements,...eles];
          const bboxIds = getBBoxIds();
          this.$store.dispatch('initBbox', bboxIds);
          if(bboxIds.length > 0){
            this.currentBboxId = bboxIds[0];
            this.handleChangeBbox(1)
          }
        })
      },
      handleImgPageChange(pageNum){
        this.currentPage = pageNum;
        this.loadImgByCurrentPageNo()
      }
    },
    data () {
      return {
        hintDialogVisible:false, // 点击添加关键点后，如果不能再添加，则弹出提示框
        hintMsg: '', // 不能继续添加关键点的提示语
        pointNameDialogVisible: false, // 选择关键点名称的dialog
        dialogMsgVisible: false, //备注
        imgId: '',
        imgPath: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549964327261&di=1d9cb6e03043f6fe199a82e1e132dd78&imgtype=0&src=http%3A%2F%2Fy0.ifengimg.com%2Fa%2F2016_16%2F808db983b318e95.jpg',
        dialogFormVisible: false, //图片地址选择框
        formLabelWidth: '100px', // 图片地址和编辑备注dialog的宽度
        tempPoint: {}, //添加点时候数组中的最后一个点
        elements: [], // 所有的元素
        skeletonElements: [], // 骨骼的元素集合
        highColor: '#FFA54F', // 初始高亮点颜色
        commonColor: '#FFFFFF', // 初始普通线条颜色
        skeletonColor: '#FF0000', // 初始骨骼颜色
        currentBboxId: -1,
        currentBboxPage: 1,
        category: {
          },
        categories:[],
        totalPage: -1,
        currentPage:-1,
        batchId: -1,
        currentBatchInfo: {} //包含当前批次的category列表，描述，id,贡献者等信息
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
