<script lang="ts" setup>
import './styles/index.scss'
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import App from './App.vue';
</script>

<template>
<el-config-provider :locale="en">
  <App />
</el-config-provider>
</template>