
const state= {
  categories:[]
};

const mutations = {
  SAVE_CATEGORY(state, data){
    state.categories = data
  }
};

const actions = {
  saveCategories({commit}, data){
    commit("SAVE_CATEGORY", data)
  }
};

const getters = {
  allCategories: state => {
    return state.categories
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
