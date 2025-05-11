<template>
  <div class="accounts-main">
    <AccountsHeader />
    <el-alert class="accounts-main_alert"
      description="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;" type="info"
      show-icon />
    <AccountsList />
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountsHeader from './AccountsHeader.vue'
import AccountsList from './AccountsList.vue'
import { onMounted } from 'vue'

const accountsStore = useAccountsStore()

onMounted(() => {
  accountsStore.loadFromLocalStorage()
})
</script>

<style scoped lang="scss">
.accounts-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &_alert {
    :deep(.el-alert__description) {
      font-size: 18px;
    }
  }
}
</style>
