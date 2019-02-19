import {deepClone} from "../../tool/Util";

const state = {
  bboxIds: [],
  keyPointsLeftName: []
};

const mutations = {
  SELECT_KEYPOINT: (state, pointName) => {
    state.keyPointsLeftName.splice(state.keyPointsLeftName.indexOf(pointName), 1)
    state.keyPointsLeftName = deepClone(state.keyPointsLeftName)
  },
  RESELECT_KEYPOINT: (state, pointName) => {
    if(state.keyPointsLeftName.indexOf(pointName) === -1){
      state.keyPointsLeftName.unshift(pointName);
      state.keyPointsLeftName = deepClone(state.keyPointsLeftName)
    }
  },
  INIT_BBOX: (state, allBoxIds) =>{
    state.bboxIds = allBoxIds
  },
  SAVE_CURRENT_KEYPOINTS: (state, allpoints) => {
    state.keyPointsLeftName = allpoints
  },
  ADD_NEW_BBOXID: (state, bboxId) => {
    state.bboxIds.push(bboxId)
  },
  DELETE_BBOXID: (state, bboxId) => {
    const index = state.bboxIds.indexOf(bboxId)
    state.bboxIds.splice(index, 1)
    state.bboxIds = deepClone(state.bboxIds);
  },
  DELETE_POINT_AND_BOX: (state, data) => {
    state.bboxIds.length = 0;
    state.keyPointsLeftName.length = 0
  }
};

const actions = {
  selectKeypoint({commit}, pointName) {
    commit('SELECT_KEYPOINT', pointName)
  },
  reselectKeypoint({commit}, pointName){
    commit('RESELECT_KEYPOINT', pointName)
  },
  saveCurrentKeyPoints({commit}, allPoints){
    commit('SAVE_CURRENT_KEYPOINTS', allPoints)
  },
  deletePointsAndBbox({commit}, data){
    commit('DELETE_POINT_AND_BOX',data)
  },
  addNewBboxId({commit}, bboxId){
    commit('ADD_NEW_BBOXID', bboxId)
  },
  deleteBboxId({commit}, bboxId){
    commit('DELETE_BBOXID', bboxId)
  },
  initBbox({commit}, bboxIds){
    commit('INIT_BBOX', bboxIds)
  }
};



const getters = {
  keyPointsLeftName: state => {
    return state.keyPointsLeftName
  },
  bboxIds: state => {
    return state.bboxIds
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
