<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watchEffect
} from 'vue'
import { ElMessageBox, type Action, type MessageBoxState } from 'element-plus'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { type Receipt, type ReceiptQuery } from './type/receipt'
import SearchForm from './components/SearchForm.vue'
import SaveForm from './components/SaveForm.vue'
import BasePagination from './components/BasePagination.vue'

type SearchParams = Params & ReceiptQuery
const dialogVisible = ref(false)
const loading = ref(false)
const saveLoading = ref(false)
const form = reactive<Receipt>({})
const tableData = reactive<PageTable<Receipt>>({
  list: [],
  total: 0
})
const PAGE_SIZE = 15
const tableHeight = ref(0)
const params = reactive<Params>({
  _page: 1,
  _limit: PAGE_SIZE,
  _sort: 'id',
  _order: 'desc'
})
const layout = ref()
const title = computed<string>(() => {
  if (form.id) return 'Edit Products'
  return 'Edit Products'
})
const baseUrl = (import.meta as ImportMeta).env.VITE_APP_BASE_API;

const fetchData = (params: SearchParams) => {
  loading.value = true
  fetch(`${baseUrl}?limit=${params._limit}&skip=${(params._page - 1) * params._limit}`)
    .then(res => res.json())
    .then(data => {
      loading.value = false
      tableData.list = data.products
      tableData.total = data.total
    })
    .catch(() => {
      loading.value = false;
    });
}

const handleSearch = (searchParams?: ReceiptQuery) => {
  // merge params
  if (searchParams?.keyword) {
    fetch(`${baseUrl}/search?q=${searchParams.keyword}`)
    .then(res => res.json())
      .then(data => {
        loading.value = false
        tableData.list = data.products
        tableData.total = data.total
      })
      .catch(() => {
        loading.value = false;
      });
  } else {
    fetchData(params);
  }
}

handleSearch()

// fetch first page data
const refresh = () => {
  params._page = 1
  fetchData(params)
}

watchEffect(() => {
  if (!saveLoading.value) {
    dialogVisible.value = false
  }
})

const toAdd = () => {
  dialogVisible.value = true
  // reset form
  Object.keys(form).forEach((item) => {
    const key = item as keyof Receipt
    form[key] = undefined
  })
}

const toEdit = (row: Receipt) => {
  dialogVisible.value = true
  Object.assign(form, row)
}
const toDelete = (id: number) => {
  ElMessageBox.confirm('Do you want delete this item？', {
    title: 'Delete',
    type: 'warning',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    beforeClose: (
      action: Action,
      instance: MessageBoxState,
      done: () => void
    ) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = 'Deleting...'
        fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
        })
          .then(() => {
            instance.confirmButtonLoading = false
            done()
            // not call fetchData
            const { list, total } = tableData
            const index = list.findIndex((item) => item.id === id)
            list.splice(index, 1)
            tableData.total -= 1
            if (total % params._limit === 0) {
              refresh()
            }
          })
      } else {
        done()
      }
    }
  })
}

const handleSubmit = (payload: Receipt) => {
  if (payload.id) {
    doEdit(payload)
  } else {
    doAdd(payload)
  }
}

const doAdd = (data: Receipt) => {
  saveLoading.value = true
  fetch('${baseUrl}/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(() => {
      saveLoading.value = false
      refresh()
    })
    .catch(() => {
      saveLoading.value = false
    })
}

const doEdit = (data: Receipt) => {
  saveLoading.value = true
  fetch(`${baseUrl}/${data.id}`, {
    method: 'PUT', /* or PATCH */
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(() => {
      saveLoading.value = false
      // not call fetchData
      const list = tableData.list
      const index = list.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        list.splice(index, 1, data as Receipt)
      }
    })
    .catch(() => {
      saveLoading.value = false
    })
}

const responsive = () => {
  if (document.body.clientWidth < 768) {
    layout.value = 'prev, pager, next'
  } else {
    layout.value = undefined
  }
  const el = document.getElementById('searchForm') as HTMLElement
  tableHeight.value = document.body.clientHeight - el.clientHeight - 140
}

onMounted(() => {
  window.addEventListener('resize', debounce(responsive, 500))
  // not relayout when testing
  if (process.env.NODE_ENV !== 'test') {
    responsive()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', responsive)
})
</script>

<template>
  <div id="app">
    <SearchForm id="searchForm" @search="handleSearch" />
    <div class="box">
      <el-button type="primary" :icon="Plus" @click="toAdd">
        Add
      </el-button>
    </div>
    <el-table v-loading="loading" :data="tableData.list" :border="true" :height="tableHeight" class="main-table">
      <el-table-column prop="title" label="Title" sortable />
      <el-table-column prop="category" label="Category" show-overflow-tooltip />
      <el-table-column prop="brand" label="Brand" sortable min-width="100" show-overflow-tooltip />
      <el-table-column prop="price" label="Price" show-overflow-tooltip />
      <el-table-column prop="stock" label="Stock" show-overflow-tooltip />
      <el-table-column prop="rating" label="Rating" show-overflow-tooltip />
      <el-table-column v-if="tableData.list?.length > 0" :fixed="layout ? 'right' : false" label="Options" width="120"
        align="center">
        <template #default="{ row }">
          <el-button type="primary" :icon="Edit" @click="toEdit(row)" />
          <el-button type="danger" :icon="Delete" @click="toDelete(row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false">
      <SaveForm :value="form" :loading="saveLoading" @submit="handleSubmit" @cancel="dialogVisible = false" />
    </el-dialog>
    <BasePagination v-model:page="params._page" v-model:limit="params._limit" :total="tableData.total" :layout="layout"
      @pagination="fetchData(params)" />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
