import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AccountType, type Account, type AccountStorage } from '@/types/account'
import { useRandomUuid } from '@/utils/uuid'
export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  function addAccount() {
    accounts.value.push({
      id: useRandomUuid(),
      type: 'Локальная',
      login: '',
      password: '',
      marks: '',
    })
  }

  function removeAccount(account: Account) {
    const foundAccountIndex = accounts.value.findIndex(ac => ac.id === account.id)
    if (foundAccountIndex === -1) return;

    accounts.value.splice(foundAccountIndex, 1)
    updateAllAccounts()
  }

  function saveAccount(account: Account) {
    const foundAccount = accounts.value.find(ac => ac.id === account.id)
    if (!foundAccount) return;

    Object.assign(foundAccount, account)
    updateAllAccounts()
  }

  function loadFromLocalStorage() {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts) as AccountStorage[]

      const convertedAccounts: Account[] = []

      for (const acc of parsedAccounts) {
        if (!acc.marks.length) continue;
  
        const marks = acc.marks.map(mark => mark.text).join(';')
        convertedAccounts.push({ ...acc, marks } as Account)
      }
      
      accounts.value = convertedAccounts
    }
  }

  function updateAllAccounts() {
    const filteredAccounts = accounts.value.filter(ac => {
      if (ac.type === AccountType.LOCAL) {
        return !!ac.login && !!ac.password
      }
      else if (ac.type === AccountType.LDAP) {
        return !!ac.login
      }

      return false
    })

    const convertedAccounts: AccountStorage[] = []

    for (const acc of filteredAccounts) {
      if (!acc.marks) continue;

      const marks = acc.marks.split(';').map(mark => ({ text: mark }))
      convertedAccounts.push({ ...acc, marks })
    }

    localStorage.setItem('accounts', JSON.stringify(convertedAccounts))
  }

  return { accounts, addAccount, removeAccount, saveAccount, loadFromLocalStorage }
})
