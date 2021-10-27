<template>
  <div>112312312
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Test',
  mounted () {
    this.$nextTick(() => {
      const body = document.querySelector('body')
      if (body.append) {
        body.append(this.$el)
      } else {
        body.appendChild(this.$el)
      }
    })
  }
}
</script>

<style scoped lang="scss">

</style>
