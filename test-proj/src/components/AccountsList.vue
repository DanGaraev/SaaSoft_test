<template>
    <div class="accounts-list">
        <div class="accounts-list_item" v-for="account in accountsStore.accounts" :key="account.id">
            <AccountsListItem :account="account" @savedSuccessfully="handleSavedSuccessfully" />
            <el-button class="accounts-header_button" type="danger" :icon="Delete" @click="removeAccount(account)" />
        </div>

        <template v-if="notificationsList.length">
            <div class="accounts-list_notifications">
                <el-alert v-for="notification in notificationsList" :key="notification.id" :title="notification.title"
                    :type="notification.type" :description="notification.description" show-icon />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { useAccountsStore } from '@/stores/accounts'
import { ref } from 'vue'
import type { Notification } from '@/types/notification'
import { useRandomUuid } from '@/utils/uuid'
import type { Account } from '@/types/account'

const accountsStore = useAccountsStore()

const notificationsList = ref<Notification[]>([])

function removeAccount(account: Account) {
    accountsStore.removeAccount(account)

    addNotification({
        id: useRandomUuid(),
        title: 'Удалено',
        description: 'Учётная запись удалена',
        type: 'warning'
    })
}

function addNotification(notification: Notification) {
    notificationsList.value.push(notification)
}

function handleSavedSuccessfully(notification: Notification) {
    addNotification(notification)
}
</script>

<style scoped lang="scss">
.accounts-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &_item {
        display: flex;
        align-items: end;
        gap: 10px;
    }

    &_notifications {
        position: fixed;
        top: 20px;
        left: 0;
        right: 0;
        width: 600px;
        margin: 0 auto;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
