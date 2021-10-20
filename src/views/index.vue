<template>
  <div class="form-container">
    <search-form
      :form-item-list="formItemList"
      :row="2"
      size="mini"
      label-width="100px"
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
          label: '名称',
          model: 'test',
          initialValue: '123'
        },
        {
          type: 'date',
          label: '名称1',
          model: 'test1',
          initialValue: [],
          attrs: {
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          },
          span: 12
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
          options: [
            {
              label: '测试1',
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
          initialValue: [],
          options: [
            {
              label: '测试1',
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
            valueFormat: 'yyyy-MM-dd'
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
