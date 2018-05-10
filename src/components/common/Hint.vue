<template>
  <div class="hint">
    <span class="error-tips">{{text}}</span>
  </div>
</template>

<script>
export default {
  name: 'Hint',
  props: {
    text: ''
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/style.scss';

.hint {
  .error-tips {
    width: 350px;
    @include flex(flex-start, center);
    color: #f44242;
    margin-bottom: -21px;
  }
}
</style>