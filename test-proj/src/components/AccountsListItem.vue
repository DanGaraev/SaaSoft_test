<template>
    <el-form ref="accountFormRef" class="account-form" :inline="true" :model="accountForm" :rules="accountFormRules">
        <el-form-item class="account-form_item">
            <el-text>Метки</el-text>
            <el-input v-model="accountForm.marks" placeholder="Метки" clearable maxlength="50" @blur="checkForm" />
        </el-form-item>
        <el-form-item class="account-form_item">
            <el-text>Тип записи</el-text>
            <el-select v-model="accountForm.type" placeholder="Тип записи" @change="handleTypeChange">
                <el-option label="Локальная" value="Локальная" />
                <el-option label="LDAP" value="LDAP" />
            </el-select>
        </el-form-item>
        <el-form-item class="account-form_item" prop="login">
            <el-text>Логин</el-text>
            <el-input v-model="accountForm.login" placeholder="Логин" clearable maxlength="100" @blur="checkForm" />
        </el-form-item>
        <el-form-item v-if="accountForm.type === AccountType.LOCAL" class="account-form_item" prop="password">
            <el-text>Пароль</el-text>
            <el-input v-model="accountForm.password" placeholder="Пароль" clearable type="password" autocomplete="off"
                maxlength="100" @blur="checkForm" />
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { AccountType, type Account } from '@/types/account'
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, useTemplateRef } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useRandomUuid } from '@/utils/uuid';
import type { Notification } from '@/types/notification';

const props = defineProps<{
    account: Account
}>()
const emit = defineEmits<{
    savedSuccessfully: [notification: Notification]
}>()

const accountsStore = useAccountsStore()
const accountForm = reactive<Account>({ ...props.account })
const accountFormRef = useTemplateRef<FormInstance>('accountFormRef')
const accountFormRules = reactive<FormRules<Account>>({
    marks: [
        { trigger: 'blur' },
    ],
    login: [
        {
            required: true,
            message: 'Введите логин',
            trigger: 'blur',
        },
    ],
    password: [
        {
            validator: validatePass,
            trigger: 'blur',
        },
    ],
})

function validatePass(rule: any, value: string | null, callback: any) {
    if (accountForm.type === AccountType.LOCAL) {
        if (value === '') {
            callback(new Error('Введите пароль'))
        }
        else {
            callback()
        }
    }
    else {
        callback()
    }
}

function handleTypeChange(value: string) {
    if (value === AccountType.LOCAL) {
        accountForm.password = ''
    }
    if (value === AccountType.LDAP) {
        accountForm.password = null
    }

    checkForm()
}

function checkForm() {
    const formEl = accountFormRef.value;
    if (!formEl) return;

    formEl.validate((valid) => {
        if (valid) {
            accountsStore.saveAccount(accountForm)
            emit('savedSuccessfully', {
                id: useRandomUuid(),
                title: 'Успешно',
                description: 'Учётная запись сохранена',
                type: 'success'
            })
        }
    })
}
</script>

<style scoped lang="scss">
.account-form {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 10px;

    &_item {
        width: 100%;
        margin: 0;

        &:nth-child(3):last-child {
            grid-column: 3 / span 2;
        }
    }

    & .el-text {
        line-height: 22px;
    }
}
</style>
