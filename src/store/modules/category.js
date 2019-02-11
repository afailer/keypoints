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
  SAVE_CURRENT_KEYPOINTS: (state, allpoints) => {
    state.keyPointsLeftName = allpoints
  },
  ADD_NEW_BBOXID: (state, bboxId) => {
    state.bboxIds.push(bboxId)
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
  addNewBboxId({commit}, bboxId){
    commit('ADD_NEW_BBOXID', bboxId)
  }
};



const getters = {
  keyPointsLeftName: state => {
    return state.keyPointsLeftName
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
