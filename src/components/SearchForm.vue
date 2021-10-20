<template>
  <el-card>
    <el-form ref="form" :model="form" v-bind="$attrs">
      <el-row :gutter="10">
        <el-col
          v-for="(item, index) in formItemList"
          v-show="index <= firstIndex || expandType"
          :key="index"
          :span="item.span || 6"
        >
          <el-form-item :label="item.label" :prop="item.model">
            <!-- input -->
            <el-input
              v-if="item.type === 'input'"
              v-model="form[item.model]"
              :placeholder="item.placeholder || ''"
              clearable
            />
            <!-- select 是否多选根据initialValue属性是否为数组判断；需要传进来options属性为select选择属性 -->
            <el-select
              v-if="item.type === 'select'"
              v-model="form[item.model]"
              class="width_100"
              :multiple="Array.isArray(item.initialValue || '')"
              collapse-tags
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="itemSub in item.options"
                :key="itemSub.value"
                :label="itemSub.label"
                :value="itemSub.value"
              ></el-option>
            </el-select>
            <!-- 日期范围选择器 -->
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="form[item.model]"
              class="width_100"
              :type="item.attrs.type"
              :format="item.attrs.format"
              :value-format="item.attrs.valueFormat"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="button_box" :span="6">
          <el-form-item label-width="0" class="button_position">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button
              v-show="spanLength >= 24 * row"
              type="text"
              @click="openForm"
            >
              <span v-if="expandType">收起筛选</span>
              <span v-else>更多筛选</span>
              <i v-if="expandType" class="el-icon-arrow-up"></i>
              <i v-else class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <section v-if="!expandType && hideFormList.length > 0" class="form_footer">
      <span>已选条件：</span>
      <el-tag
        v-for="(tag, index) in hideFormList"
        :key="index"
        size="mini"
        closable
        @close="closeTag(tag)"
      >
        <span v-if="tag.type === 'input'">
          {{ tag.label }}: {{ tag.value }}
        </span>
        <span v-else-if="tag.type === 'select'">
          {{ tag.label }}: {{ tag.value.map((item) => item.label).toString() }}
        </span>
        <span v-else-if="tag.type === 'date'">
          {{ tag.label }}: {{ tag.value[0] }} 至 {{ tag.value[1] }}
        </span>
      </el-tag>
    </section>
  </el-card>
</template>

<script>
export default {
  name: 'search-form-config',
  props: {
    formItemList: {
      // 表单基本配置数据
      type: Array,
      default: () => []
    },
    row: {
      // 默认展示行数
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      form: {},
      expandType: false,
      itemList: [],
      firstIndex: 0, // 记录第一行展示的下标
      spanLength: 0,
      hideFormList: []
    }
  },
  mounted () {
    // 根据span的总数判断第一行所展示的个数
    this.spanLength = 0
    // 获取初始化this.form数据
    const formKey = {}
    this.formItemList.forEach((item, index) => {
      this.spanLength += item.span || 6
      formKey[item.model] = item.initialValue || ''
      if (this.spanLength < 24 * this.row) {
        this.firstIndex = index
      }
    })
    this.form = formKey
  },
  methods: {
    handleSearch () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.expandType = false
          this.getHideData()
        }
      })
    },
    // 清除单条隐藏数据
    closeTag (tag) {
      this.hideFormList = this.hideFormList.filter(
        (item) => item.key !== tag.key
      )
      this.resetForm(tag)
    },
    // 单条清除数据后重置form数据
    resetForm (tag) {
      Object.keys(this.form).forEach((item) => {
        if (item === tag.key) {
          if (typeof this.form[item] === 'string') {
            this.$set(this.form, item, '')
          } else if (this.form[item] instanceof Array) {
            this.$set(this.form, item, [])
          }
        }
      })
    },
    // 获取隐藏数据
    getHideData () {
      this.hideFormList = []
      Object.keys(this.form).forEach((item, index) => {
        if (index > this.firstIndex) {
          this.formItemList.forEach((formItem) => {
            if (
              item === formItem.model &&
                typeof this.form[item] === 'string' &&
                this.form[item] !== ''
            ) {
              this.hideFormList.push({
                type: formItem.type,
                key: item,
                value: this.form[item],
                label: formItem.label
              })
            } else if (
              item === formItem.model &&
                typeof this.form[item] === 'object' &&
                Array.isArray(this.form[item]) &&
                this.form[item].length > 0
            ) {
              const valueArr = []
              if (formItem.type === 'select') {
                // 如果是select的话需要把label加进来，便于做展示
                formItem.options.forEach((option) => {
                  this.form[item].forEach((valueItem) => {
                    if (option.value === valueItem) {
                      valueArr.push({ label: option.label, value: valueItem })
                    }
                  })
                })
                this.hideFormList.push({
                  type: formItem.type,
                  key: item,
                  value: valueArr,
                  label: formItem.label
                })
              } else if (formItem.type === 'date') {
                // 如果是date的话需要判断初始值是否为数组，便于做展示
                this.hideFormList.push({
                  type: formItem.type,
                  key: item,
                  value: this.form[item],
                  label: formItem.label
                })
              }
            }
          })
        }
      })
    },
    // 更多筛选点击事件,根据记录的下标去截取和拼接itemList
    openForm () {
      this.expandType = !this.expandType
      this.getHideData()
    },
    // 重置表单数据
    handleReset () {
      const formKey = {}
      this.formItemList.forEach((item) => {
        formKey[item.model] = item.initialValue || ''
      })
      this.hideFormList = []
      this.form = formKey
    }
  }
}
</script>

<style lang="scss">
  .button_box {
    float: right;
    .button_position {
      display: flex;
      justify-content: right;
    }
  }
  .width_100 {
    width: 100%;
  }
  .form_footer {
    display: flex;
    align-items: center;
    width: calc(100% - 20px);
    padding: 10px;
    overflow: hidden;
    background: rgba(37, 42, 61, 0.03);
    border: 1px #c0c4cc dashed;
  }
</style>
