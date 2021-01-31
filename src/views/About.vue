<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h3>{{ backendData }}</h3>
    <button @click="getbackendData">获取数据</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      backendData: [],
    }
  },
  methods: {
    getbackendData() {
      const path = 'http://localhost:80/backendData'
      axios.get(path)
      .then(response => {
        this.backendData = response.data.backendData
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
};
</script>