<template>
  <el-dialog
    title="请选择点的名称"
    :visible="pointNameDialogVisible"
    width="30%"
    >
    <el-select v-model="pointValue" placeholder="请选择">
      <el-option
        v-for="item in this.$store.getters.keyPointsLeftName"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <el-radio-group v-model="pointVisible">
      <el-radio :label="1">不可见</el-radio>
      <el-radio :label="2">可见</el-radio>
    </el-radio-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取 消</el-button>
      <el-button type="primary" @click='handleSave'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'pointNameDialog',
  props:['pointNameDialogVisible', 'getPointName', 'cancleDrawPoint'],
  data() {
    return{
      pointValue: '',
      pointVisible: 1
    }
  },
  methods: {
    handleCancle(){
      this.cancleDrawPoint();
      this.pointValue = ''
    },
    handleSave(){
      this.getPointName(this.pointValue, this.pointVisible);
      this.$store.dispatch('selectKeypoint', this.pointValue);
      this.pointValue = ''
    }
  }
}
</script>

<style>

</style>
