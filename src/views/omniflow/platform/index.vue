<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="平台名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入平台名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="平台编码" prop="code">
        <el-select v-model="queryParams.code" placeholder="平台类型" clearable style="width: 240px">
          <el-option v-for="dict in sys_platform_code" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="平台状态" clearable style="width: 240px">
          <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['omniflow:platform:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['omniflow:platform:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['omniflow:platform:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="platformList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="平台ID" align="center" key="id" prop="id" v-if="columns.id.visible" width="80" />
      <el-table-column label="平台名称" align="center" key="name" prop="name" v-if="columns.name.visible" :show-overflow-tooltip="true" min-width="120" />
      <el-table-column label="平台编码" align="center" key="code" prop="code" v-if="columns.code.visible" width="100">
        <template #default="scope">
          <dict-tag :options="sys_platform_code" :value="scope.row.code" />
        </template>
      </el-table-column>
      <el-table-column label="API配置" align="center" key="apiConfig" prop="apiConfig" v-if="columns.apiConfig.visible" :show-overflow-tooltip="true" min-width="150" />
      <el-table-column label="状态" align="center" key="status" prop="status" v-if="columns.status.visible" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns.createTime.visible" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['omniflow:platform:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['omniflow:platform:remove']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改平台配置对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form :model="form" :rules="rules" ref="platformRef" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="平台名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入平台名称" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="平台编码" prop="code">
              <el-select v-model="form.code" placeholder="请选择平台编码" style="width: 100%">
                <el-option v-for="dict in sys_platform_code" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="API配置" prop="apiConfig">
              <el-input v-model="form.apiConfig" type="textarea" :rows="8" placeholder='请输入API配置（JSON格式），例如：{"appId":"xxx","appSecret":"xxx"}' />
              <div class="el-form-item__help" style="color: #909399; font-size: 12px; margin-top: 4px;">
                请输入有效的JSON格式配置，包含必要的认证信息
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Platform">
import { listPlatform, getPlatform, delPlatform, addPlatform, updatePlatform } from "@/api/omniflow/platform"

const { proxy } = getCurrentInstance()
const { sys_normal_disable, sys_platform_code } = proxy.useDict("sys_normal_disable", "sys_platform_code")

const platformList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const columns = ref({
  id: { label: '平台ID', visible: true },
  name: { label: '平台名称', visible: true },
  code: { label: '平台编码', visible: true },
  apiConfig: { label: 'API配置', visible: true },
  status: { label: '状态', visible: true },
  createTime: { label: '创建时间', visible: true }
})

// API配置编辑器状态
const apiConfigEditorOpen = ref(false)
const apiConfigEditorData = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    code: undefined,
    status: undefined
  },
  rules: {
    name: [
      { required: true, message: "平台名称不能为空", trigger: "blur" },
      { min: 2, max: 50, message: "平台名称长度在 2 到 50 个字符", trigger: "blur" },
      { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_]+$/, message: "平台名称只能包含中文、字母、数字、空格、横线和下划线", trigger: "blur" }
    ],
    code: [
      { required: true, message: "平台编码不能为空", trigger: "change" }
    ],
    apiConfig: [
      { required: true, message: "API配置不能为空", trigger: "blur" },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          try {
            const config = JSON.parse(value)
            if (typeof config !== 'object' || config === null) {
              callback(new Error('API配置必须是有效的JSON对象'))
            } else {
              callback()
            }
          } catch (e) {
            callback(new Error('API配置必须是有效的JSON格式'))
          }
        },
        trigger: "blur"
      }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询平台列表 */
function getList() {
  loading.value = true
  listPlatform(queryParams.value).then(res => {
    loading.value = false
    platformList.value = res.rows
    total.value = res.total
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加平台配置"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const platformId = row.id || ids.value
  getPlatform(platformId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改平台配置"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["platformRef"].validate(valid => {
    if (valid) {
      // 验证JSON格式
      try {
        JSON.parse(form.value.apiConfig)
      } catch (e) {
        proxy.$modal.msgError("API配置格式错误，请输入有效的JSON")
        return
      }

      if (form.value.id != undefined) {
        updatePlatform(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPlatform(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const platformIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除平台编号为"' + platformIds + '"的数据项？').then(function () {
    return delPlatform(platformIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("omniflow/platform/export", {
    ...queryParams.value,
  }, `platform_${new Date().getTime()}.xlsx`)
}

/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
    name: undefined,
    code: undefined,
    apiConfig: undefined,
    status: "0"
  }
  proxy.resetForm("platformRef")
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.el-form-item__help {
  line-height: 1.5;
}
</style>
