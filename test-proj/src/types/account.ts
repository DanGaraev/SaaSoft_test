export const AccountType = {
    LOCAL: 'Локальная',
    LDAP: 'LDAP'
} as const

type AccountTypeValues = typeof AccountType[keyof typeof AccountType]

interface AccountBase {
    id: string
    marks: string | { text: string }[]
    type: AccountTypeValues
    login: string
    password: string | null
}

interface LDAPAccount extends AccountBase {
    marks: string
    type: 'LDAP'
    password: null
}

interface LocalAccount extends AccountBase {
    marks: string
    type: 'Локальная'
    password: string
}

export interface AccountStorage extends AccountBase {
    marks: { text: string }[]
}

export type Account = LDAPAccount | LocalAccount



