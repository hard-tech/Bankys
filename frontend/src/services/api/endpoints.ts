export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        me: '/auth/me',
    },
    accounts: {
        create: '/account/create',
        getAll: '/account/get/all',
        close: (accountRequest: string) => `/account/close/${accountRequest}`,
        info: '/account/info',
    },
    transactions: {
        deposit: '/transactions/deposit',
        withdrawal: '/transactions/withdrawal',
        transfer: '/transactions/transfer',
        info: (transactionId: number) => `/transactions/info/${transactionId}`,
        getAll: '/transactions/get/all',
        cancel: (transactionId: number) => `/transactions/cancel/${transactionId}`,
    },
    beneficiaires: {
        create: '/beneficiaires/create',
        getAll: '/beneficiaires/get/all',
    }
};
  