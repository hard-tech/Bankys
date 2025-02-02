export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        me: '/auth/me',
        changePassword: '/auth/change/password',
    },
    accounts: {
        create: '/account/create',
        getAll: '/account/get/all',
        close:  '/account/close',
        info: '/account/info',
    },
    transactions: {
        deposit: '/transactions/deposit',
        withdrawal: '/transactions/withdrawal',
        transfer: '/transactions/transfer',
        info: (transactionId: number) => `/transactions/info/${transactionId}`,
        getAll: '/transactions/get/all',
        stats: '/transactions/get/stats',
        cancel: (transactionId: number) => `/transactions/cancel/${transactionId}`,
        downloadStatement: (iban: string) => `/transactions/download-statement/${iban}`,
    },
    beneficiaries: {
        create: '/beneficiaires/create',
        getAll: '/beneficiaires/get/all',
        delete: (beneficiaryId: number) => `/beneficiaires/delete/${beneficiaryId}`,
    }
};
  