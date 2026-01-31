<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商家名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入商家名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="queryParams.contactPhone" placeholder="请输入联系电话" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="商家状态" clearable style="width: 240px">
          <el-option v-for="dict in sys_merchant_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['omniflow:merchant:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['omniflow:merchant:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['omniflow:merchant:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="merchantList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商家ID" align="center" key="id" prop="id" v-if="columns.id.visible" />
      <el-table-column label="商家名称" align="center" key="name" prop="name" v-if="columns.name.visible" :show-overflow-tooltip="true" />
      <el-table-column label="联系电话" align="center" key="contactPhone" prop="contactPhone" v-if="columns.contactPhone.visible" width="120" />
      <el-table-column label="地址" align="center" key="address" prop="address" v-if="columns.address.visible" :show-overflow-tooltip="true" min-width="150" />
      <el-table-column label="平台" align="center" key="platformIds" prop="platformIds" v-if="columns.platformIds.visible" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.platformIds" type="success" size="small">
            {{ formatPlatformIds(scope.row.platformIds) }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" key="status" prop="status" v-if="columns.status.visible">
        <template #default="scope">
          <dict-tag :options="sys_merchant_status" :value="scope.row.status" />
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
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['omniflow:merchant:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['omniflow:merchant:remove']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改商家配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="merchantRef" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商家名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入商家名称" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" maxlength="200" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="平台配置" prop="platformIds">
              <el-checkbox-group v-model="platformCheckbox" @change="handlePlatformChange">
                <el-checkbox label="1">美团</el-checkbox>
                <el-checkbox label="2">饿了么</el-checkbox>
                <el-checkbox label="3">抖音</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_merchant_status" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
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

<script setup name="Merchant">
import { listMerchant, getMerchant, delMerchant, addMerchant, updateMerchant } from "@/api/omniflow/merchant"

const { proxy } = getCurrentInstance()
const { sys_merchant_status } = proxy.useDict("sys_merchant_status")

const merchantList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const columns = ref({
  id: { label: '商家ID', visible: true },
  name: { label: '商家名称', visible: true },
  contactPhone: { label: '联系电话', visible: true },
  address: { label: '地址', visible: true },
  platformIds: { label: '平台', visible: true },
  status: { label: '状态', visible: true },
  createTime: { label: '创建时间', visible: true }
})

// 平台复选框（用于编辑时将 platformIds 转换为数组）
const platformCheckbox = ref([])

// 平台名称映射
const platformNameMap = {
  '1': '美团',
  '2': '饿了么',
  '3': '抖音'
}

/** 格式化平台IDs显示 */
function formatPlatformIds(platformIds) {
  if (!platformIds) return '-'
  const ids = platformIds.split(',').filter(id => id)
  return ids.map(id => platformNameMap[id] || id).join('、')
}

/** 处理平台复选框变化 */
function handlePlatformChange(checkedValues) {
  form.value.platformIds = checkedValues.length > 0 ? checkedValues.join(',') : undefined
}

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    contactPhone: undefined,
    status: undefined
  },
  rules: {
    name: [{ required: true, message: "商家名称不能为空", trigger: "blur" }],
    contactPhone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" },
      { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }
    ],
    address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
    platformIds: [{ required: true, message: "请至少选择一个平台", trigger: "change" }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询商家列表 */
function getList() {
  loading.value = true
  listMerchant(queryParams.value).then(res => {
    loading.value = false
    merchantList.value = res.rows
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
  title.value = "添加商家"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const merchantId = row.id || ids.value
  getMerchant(merchantId).then(response => {
    form.value = response.data
    // 将 platformIds 转换为复选框数组
    if (form.value.platformIds) {
      platformCheckbox.value = form.value.platformIds.split(',')
    }
    open.value = true
    title.value = "修改商家"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["merchantRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateMerchant(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMerchant(form.value).then(() => {
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
  const merchantIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除商家编号为"' + merchantIds + '"的数据项？').then(function () {
    return delMerchant(merchantIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("omniflow/merchant/export", {
    ...queryParams.value,
  }, `merchant_${new Date().getTime()}.xlsx`)
}

/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
    name: undefined,
    contactPhone: undefined,
    address: undefined,
    platformIds: undefined,
    status: "0"
  }
  platformCheckbox.value = []
  proxy.resetForm("merchantRef")
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
