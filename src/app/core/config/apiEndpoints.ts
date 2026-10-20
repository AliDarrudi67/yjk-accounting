export const ApiEndpoints = {
  admin: {
    login: 'admin/login.php',
    info: 'admin/info.php',
    permissions: (adminId: number = -1) =>
      `admin/permissions.php?adminId=${adminId}`,
    list: 'admin/adminList.php',
    add: 'admin/addAdmin.php',
    edit: 'admin/editAdmin.php',
    delete: 'admin/deleteAdmin.php',
  },
  admin_permission: {
    save: 'admin_permission/saveAdminPermission.php',
  },
  company: {
    add: 'company/add.php',
    edit: 'company/edit.php',
    delete: 'company/delete.php',
    list: 'company/list.php',
    select: (id: number) => `company/select.php?id=${id}`,
    accounts: (id: number, date: string) =>
      `company/accounts.php?companyId=${id}&date=${date}`,
  },
  account: {
    add: 'account/add.php',
    edit: 'account/edit.php',
    delete: 'account/delete.php',
    list: 'account/list.php',
    select: (id: number) => `account/select.php?id=${id}`,
  },
  transaction: {
    add: 'transaction/add.php',
    edit: 'transaction/edit.php',
    delete: 'transaction/delete.php',
    deleteAttachment: 'transaction/deleteAttachment.php',
    todayDueDocuments: (todayDate: string) =>
      `transaction/todayDueDocuments.php?todayDate=${todayDate}`,
    latestTransactions: 'transaction/latestTransactions.php',
    allAdjustments: (accountId: number, date: string) =>
      `transaction/allAdjustments.php?accountId=${accountId}&date=${date}`,
    applyToBalance: 'transaction/applyToBalance.php',
    list: (accountId: number, date: string) =>
      `transaction/list.php?accountId=${accountId}&date=${date}`,
    select: (id: number) => `transaction/select.php?id=${id}`,
    receivables: (id: number, date: string) =>
      `transaction/receivables.php?accountId=${id}&date=${date}`,
    payaybles: (id: number, date: string) =>
      `transaction/payaybles.php?accountId=${id}&date=${date}`,
    transactions: (id: number) =>
      `transaction/transactions.php?transaction_id=${id}`,
  },
  stat: {
    companyStat: (companyId: number, date: string) =>
      `stat/stat.php?scope=company&companyId=${companyId}&date=${date}`,
    accountStat: (accountId: number, date: string) =>
      `stat/stat.php?scope=account&accountId=${accountId}&date=${date}`,
    allStat: (date: string) => `stat/allStat.php?&startDate=${date}`,
    monthlyStat: (startDate: string, endDate: string, companyId: number) =>
      `stat/monthly-stat.php?&startDate=${startDate}&endDate=${endDate}&companyId=${companyId}`,
  },
};
