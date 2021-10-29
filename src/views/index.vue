<template>
  <div class="form-container">
    <search-form
      :form-item-list="formItemList"
      :row="2"
      size="mini"
      label-width="110px"
      @getSearchFormData="getSearchFormData"
    ></search-form>

  </div>
</template>

<script>
import SearchForm from '../components/SearchForm'
export default {
  name: 'Form',
  components: { SearchForm },
  data () {
    return {
      ruleForm: {
        name: '12312',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rulesOne: {
        test: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      formItemList: [
        {
          type: 'input',
          turnLabel: true,
          model: 'model1',
          label: '销售单号',
          placeholder: '1231',
          initialValue: '',
          dropdownType: 'test',
          attrs: {
            options: [
              {
                model: 'model1',
                label: '销售单号',
                placeholder: '1231',
                initialValue: ''
              },
              {
                model: 'model2',
                label: '来源单据号',
                placeholder: '1231333',
                initialValue: ''
              }
            ]
          }
        },
        {
          type: 'input',
          label: '名称',
          model: 'test',
          initialValue: '123'
        },
        {
          type: 'date',
          label: '名称1',
          model: 'test1',
          initialValue: [],
          turnKey: true,
          attrs: {
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'timestamp',
            begin: 'beginDate1',
            end: 'endDate1',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            rangeSeparator: '至'
          },
          span: 12
        },
        {
          type: 'date',
          label: '日期',
          model: 'datessss',
          initialValue: '',
          attrs: {
            type: 'date',
            format: 'yyyy-MM-dd',
            valueFormat: 'timestamp'
          },
          span: 6
        },
        {
          type: 'input',
          label: '名称2',
          model: 'test2',
          span: 6
        },
        {
          type: 'input',
          label: '名称3',
          model: 'test3',
          span: 6
        },
        {
          type: 'select',
          label: '名称4',
          model: 'test4',
          initialValue: [],
          change: this.selectChange,
          options: [
            {
              label: '测试1测试1测试1测试1测试1测试1',
              value: 'q123'
            },
            {
              label: '测试2',
              value: 'q'
            }
          ],
          span: 6
        },
        {
          type: 'select',
          label: '名称5',
          model: 'test5',
          initialValue: [],
          options: [],
          span: 6
        },
        {
          type: 'input',
          label: '名称6',
          model: 'test6',
          span: 6
        },
        {
          type: 'select',
          label: '名称7',
          model: 'test7',
          initialValue: '',
          options: [
            {
              label: '测试1测试1测试1测试1测试1测试1',
              value: 'q123'
            },
            {
              label: '测试2',
              value: 'q'
            }
          ],
          span: 6
        },
        {
          type: 'date',
          label: '名称8',
          model: 'test8',
          initialValue: [],
          attrs: {
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'timestamp',
            begin: 'beginDate',
            end: 'endDate',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            rangeSeparator: '至'
          },
          span: 12
        }
      ]
    }
  },
  mounted () {
    setTimeout(() => {
      this.options = [
        {
          label: '测试1',
          value: 'q123'
        },
        {
          label: '测试2',
          value: 'q'
        }
      ]
      this.formItemList.forEach((item) => {
        if (item.model === 'test5') {
          item.options = this.options
        }
      })
    }, 2000)
  },
  methods: {
    selectChange (value, item) {
      console.log(value)
      console.log(item)
    },
    dateChange (date, item) {
      console.log(date)
      console.log(item)
    },
    getSearchFormData (data) {
      console.log('form', data)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
