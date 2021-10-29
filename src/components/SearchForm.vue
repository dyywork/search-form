<template>
  <el-card shadow="never">
    <el-form ref="form" :model="form" v-bind="$attrs" v-on="$listeners">
      <el-row>
        <el-col
          v-for="(item, index) in formItemList"
          v-show="index <= firstIndex || expandType"
          :key="index"
          :span="item.span || 6"
        >
          <el-form-item v-if="item.turnLabel">
            <template v-slot:label>
              <el-dropdown @command="(event) => handleCommand(event, item)">
                <span class="dropdown-label">
                  {{ item.label }}
                  <i class="el-icon-caret-bottom el-icon--right dropdown-icon" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(dropdown, dropIndex) in item.attrs.options" :key="dropIndex" :command="dropdown.model">{{ dropdown.label }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <el-input
              class="width_100"
              v-model="form[item.model]"
              :placeholder="item.placeholder"
              clearable
            />
          </el-form-item>
          <el-form-item v-else :label="item.label" :prop="item.model">
            <!-- input -->
            <el-input
              v-if="item.type === 'input'"
              v-model="form[item.model]"
              :placeholder="item.placeholder || '请输入'"
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
              filterable
              :placeholder="item.placeholder || '请选择'"
              @change="(event) => selectChange(event, item)"
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
              :style="item.type === 'date' && item.attrs.type === 'daterange' ? {width: '264px', marginRight: '10px'}: {}"
              v-model="form[item.model]"
              :type="item.attrs.type || 'date'"
              :format="item.attrs.format || 'yyyy-MM-dd'"
              :value-format="item.attrs.valueFormat || 'timestamp'"
              :placeholder="item.placeholder || '请选择'"
              :range-separator="item.attrs.rangeSeparator || '至'"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="(event) => dateChange(event, item)"
            ></el-date-picker>
            <div v-if="item.type === 'date' && item.attrs.type === 'daterange'" style="display: inline-block; position: relative; top:-1px">
              <el-button v-for="time in dateList" :key="time.value" @click="createDate(time, item)">{{time.name}}</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col class="button_box" :span="6">
          <el-form-item label-width="0" class="button_position">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
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
        closable
        size="mini"
        class="tag_box"
        @close="closeTag(tag)"
      >
        <span v-if="tag.type === 'input'">
          {{ tag.label }}: {{ tag.value }}
        </span>
        <span v-else-if="tag.type === 'select'">
          {{ tag.label }}: {{ tag.value.map((item) => item.label).toString() }}
        </span>
        <span v-else-if="tag.type === 'daterange'">
          {{ tag.label }}: {{ dayjs(tag.value[0]).format('YYYY-MM-DD') }} 至 {{ dayjs(tag.value[1]).format('YYYY-MM-DD') }}
        </span>
        <span v-else-if="tag.type === 'datetimerange'">
          {{ tag.label }}: {{ dayjs(tag.value[0]).format('YYYY-MM-DD HH:mm:ss') }} 至 {{ dayjs(tag.value[1]).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
        <span v-else-if="tag.type === 'monthrange'">
          {{ tag.label }}: {{ dayjs(tag.value[0]).format('YYYY-MM') }} 至 {{ dayjs(tag.value[1]).format('YYYY-MM') }}
        </span>
        <span v-else-if="tag.type === 'dates'">
          {{ tag.label }}: {{ tag.value.map(item => dayjs(item).format('YYYY-MM-DD')).toString() }}
        </span>
        <span v-else-if="tag.type === 'week'">
          {{ tag.label }}: {{ tag.value }}
        </span>
        <span v-else-if="tag.type === 'date'">
          {{ tag.label }}: {{ dayjs(tag.value).format('YYYY-MM-DD') }}
        </span>
      </el-tag>
    </section>
  </el-card>
</template>

<script>
import mixins from './mixins/mixins'
import dayjs from 'dayjs'
export default {
  name: 'SearchFormConfig',
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
  mixins: [mixins],
  data () {
    return {
      dayjs: dayjs,
      form: {},
      expandType: false,
      itemList: [],
      firstIndex: 0, // 记录第一行展示的下标
      spanLength: 0,
      hideFormList: [],
      dateList: [
        {
          name: '今',
          type: 'today'
        },
        {
          name: '昨',
          type: 'yesterday'
        },
        {
          name: '近7天',
          type: 'week'
        },
        {
          name: '近30天',
          type: 'month'
        }
      ]
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
          this.spreadData(this.form)
          this.expandType = false
          this.getHideData()
        }
      })
    },
    // 时间快捷选择
    createDate (time, item) {
      console.log(item)
      console.log(time)
      const date = new Date()
      if (time.type === 'today') {
        this.form[item.model] = [date.getTime(), date.getTime()]
      } else if (time.type === 'yesterday') {
        this.form[item.model] = [date.getTime() - 3600 * 1000 * 24, date.getTime() - 3600 * 1000 * 24]
      } else if (time.type === 'week') {
        this.form[item.model] = [date.getTime() - 7 * 3600 * 1000 * 24, date.getTime()]
      } else if (time.type === 'month') {
        this.form[item.model] = [date.getTime() - 30 * 3600 * 1000 * 24, date.getTime()]
      }
    },
    // select 选择后触发
    selectChange (value, item) {
      if (item.change) {
        item.change(value, item)
      }
    },
    // 日期范围选择器change方法触发
    dateChange (date, item) {
      if (item.change) {
        item.change(date, item)
      }
    },
    // 切换label
    handleCommand (data, row) {
      this.formItemList.forEach((item, index) => {
        if (item.dropdownType === row.dropdownType) {
          row.attrs.options.forEach(itemRow => {
            if (itemRow.model === data) {
              this.$set(this.formItemList, index, {
                ...row,
                ...itemRow
              })
            } else {
              this.form[itemRow.model] = ''
            }
          })
        }
      })
      this.getHideData()
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
          } else {
            this.$set(this.form, item, '')
          }
        }
      })
      this.spreadData(this.form)
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
      this.spreadData(this.form)
    },
    // 向父组件传递处理好的数据
    spreadData (data) {
      const dataObj = JSON.parse(JSON.stringify(data))
      this.formItemList.forEach((item) => {
        Object.keys(dataObj).forEach((key) => {
          if (item.turnKey && item.model === key) {
            if (item.type === 'date' && item.attrs.valueFormat === 'timestamp') {
              dataObj[item.attrs.begin] = dataObj[key][0] || ''
              dataObj[item.attrs.end] = dataObj[key][1] ? dataObj[key][1] + 86399000 : ''
            } else if (item.type === 'date' && item.attrs.valueFormat === 'yyyy-MM-dd') {
              dataObj[item.attrs.begin] = dataObj[key][0] || ''
              dataObj[item.attrs.end] = dataObj[key][1] ? dataObj[key][1] + '23:59:59' : ''
            } else if (item.type === 'date' && item.attrs.valueFormat === 'yyyy-MM-dd HH:mm:ss') {
              dataObj[item.attrs.begin] = dataObj[key][0] || ''
              dataObj[item.attrs.end] = dataObj[key][1] || ''
            }
            delete dataObj[key]
          } else if (item.turnKey && item.model === key && dataObj[key].length === 0) {
            delete dataObj[key]
          } else if (item.turnLabel && item.model === key) {
            item.attrs.options.forEach(drop => {
              if (drop.model !== item.model) {
                dataObj[drop.model] = ''
              }
            })
          }
        })
      })
      this.$emit('getSearchFormData', dataObj)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep{
  .el-select__tags{
    span:nth-child(1) {
      span:nth-child(1) {
        span{
          max-width: 100px;
        }
      }
    }
  }
}
.button_box {
  float: right;
  .button_position {
    display: flex;
    justify-content: right;
  }
}
.tag_box{
  margin-left: 5px;
  display: inline-block;
  float: left;
}
.float_left{
  float: left;
}
.width_100 {
  width: 100% !important;
}
.form_footer {
  display: flex;
  align-items: center;
  width: calc(100% - 20px);
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(37, 42, 61, 0.03);
  border: 1px #c0c4cc dashed;
}
</style>
