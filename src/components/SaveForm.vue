<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { type Receipt } from '../type/receipt'
import { nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import rules from '../utils/rules'
import BaseInput from './BaseInput.vue'

const props = defineProps<{
  value: Receipt
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', value: Receipt): void
  (e: 'cancel'): void
}>()

const form = reactive(props.value)
const position = ref<'left' | 'right' | 'top'>('right')
const ruleFormRef = ref<FormInstance>()

onMounted(() => {
  if (window.screen.width < 767) {
    position.value = 'top'
  }
})

watchEffect(() => {
  Object.assign(form, props.value)
  nextTick(() => {
    ruleFormRef.value!.clearValidate()
  })
})

const handleSubmit = () => {
  ruleFormRef.value!.validate((valid) => {
    if (valid) {
      emit('submit', { ...form })
    }
  })
}

const handleCancel = () => {
  ruleFormRef.value!.clearValidate()
  emit('cancel')
}
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    :rules="rules"
    class="save-form"
    label-width="80px"
    :label-position="position"
  >
    <el-form-item
      label="Title"
      prop="title"
    >
      <BaseInput v-model="form.title" />
    </el-form-item>
    <el-form-item
      label="Category"
      prop="category"
    >
      <BaseInput v-model="form.category" />
    </el-form-item>
    <el-form-item
      label="Brand"
      prop="brand"
    >
      <BaseInput v-model="form.brand" />
    </el-form-item>
    <el-form-item
      label="Price"
      prop="price"
    >
      <BaseInput v-model="form.price" />
    </el-form-item>
    <el-form-item
      label="Stock"
      prop="stock"
    >
      <BaseInput v-model="form.stock" />
    </el-form-item>
    <el-form-item
      label="Rating"
      prop="rating"
    >
      <BaseInput v-model="form.rating" />
    </el-form-item>
    <el-form-item class="footer-item">
      <el-button @click="handleCancel"> Cancel </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit"
        title="submit"
      >
        OK
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss">
.save-form {
  .el-input {
    width: 100%;
  }

  .footer-item {
    margin-bottom: 0;

    .el-form-item__content {
      justify-content: flex-end;
    }
  }
}
</style>
