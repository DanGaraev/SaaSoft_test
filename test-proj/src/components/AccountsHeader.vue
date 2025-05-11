<template>
  <div class="accounts-header">
    <el-text class="accounts-header_title" tag="h1" size="large">Учётные записи</el-text>
    <el-button class="accounts-header_button" type="primary" :icon="Plus" @click="addAccount" />
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useAccountsStore } from '@/stores/accounts'

const emit = defineEmits<{
  addAccount: []
}>()

const accountsStore = useAccountsStore()

function addAccount() {
  accountsStore.addAccount()
}
</script>

<style scoped lang="scss">
.accounts-header {
  display: flex;
  align-items: center;
  gap: 10px;

  .accounts-header_title {
    font-size: 24px;
  }
}
</style>
