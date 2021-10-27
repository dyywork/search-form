<template>
  <div>
    <template v-if="uiLoading">
      <div :class="['el-skeleton', animated ? 'is-animated' : '', ]" v-bind="$attrs">
        <template v-for="i in count">
          <slot v-if="loading" name="template">
            <el-skeleton-item
              v-for="item in rows"
              :key="`${i}-${item}`"
              :class="{
                'el-skeleton__paragraph': item !== 1,
                'is-first': item === 1,
                'is-last': item === rows && rows > 1,
              }"
              variant="p"
            />
          </slot>
        </template>
      </div>
    </template>
    <template v-else>
      <slot v-bind="$attrs"></slot>
    </template>
  </div>
</template>
<script>
export default {
  name: 'MgSkeleton',
  props: {
    animated: {
      type: Boolean,
      default: true
    },
    count: {
      type: Number,
      default: 1
    },
    rows: {
      type: Number,
      default: 4
    },
    loading: {
      type: Boolean,
      default: true
    },
    throttle: {
      type: Number,
      default: 0
    }
  },
  watch: {
    loading: {
      handler (loading) {
        if (this.throttle <= 0) {
          this.uiLoading = loading
          return
        }
        if (loading) {
          clearTimeout(this.timeoutHandle)
          this.timeoutHandle = setTimeout(() => {
            this.uiLoading = this.loading
          }, this.throttle)
        } else {
          this.uiLoading = loading
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      uiLoading: this.throttle <= 0 ? this.loading : false
    }
  }
}
</script>
<style scoped lang="scss">
.el-skeleton.is-animated .el-skeleton__item {
  background: linear-gradient(
      90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
  background-size: 400% 100%;
  animation: el-skeleton-loading 1.4s ease infinite;
}
@keyframes el-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
.el-skeleton__p.is-first {
  width: 33%;
}
.el-skeleton__item {
  background: #f2f2f2;
  display: inline-block;
  height: 16px;
  border-radius: 4px;
  width: 100%;
}

</style>
