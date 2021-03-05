import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        g:'',
    },
    mutations:{
        setG(state,g){
            state.g = g
        },
    }
})

export default store