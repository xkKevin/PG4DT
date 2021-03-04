import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        svg:'',
    },
    mutations:{
        setSvg(state,svg){
            state.svg = svg
        },
    }
})

export default store