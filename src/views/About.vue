<template>
  <div class="about">
    <h1>This is an about page</h1>
    <test>
      123123{{name}}
    </test>
    <mg-skeleton animated :loading="loading">
      123123
    </mg-skeleton>
  </div>
</template>
<script>
import Test from './components/Test'
import MgSkeleton from './skeleton/MgSkeleton'
export default {
  name: 'About',
  components: { MgSkeleton, Test },
  data () {
    return {
      name: 'Cesar',
      loading: false
    }
  },
  mounted () {
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 5000)
  }
}
</script>
