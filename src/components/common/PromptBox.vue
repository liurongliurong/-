<template>
  <div class="prompt">
    <div class="screen"></div>
    <div class="box">
      <img :src="info.icon" />
      <p class="title">{{info.title}}</p>
      <p class="content">{{text}}</p>
      <div class="button-group">
        <button @click="submit('success')">确定</button>
        <button v-if="model==='select'" class="cancel" @click="submit('cancel')">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PromptBox',
  data () {
    return {
      info: {}
    }
  },
  props: {
    model: '',
    text: ''
  },
  created () {
    this.getModel()
  },
  methods: {
    getModel () {
      switch (this.model) {
        case 'tips':
        case 'select':
          this.info = {
            title: '提示',
            icon: require('@/assets/common/icon-tips.png')
          }
          break
        default: break
      }
    },
    submit (value) {
      this.$emit('submit', value)
    }

  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/common/prompt-box.scss';
</style>