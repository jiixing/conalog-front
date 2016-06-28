import Reflux from 'reflux'

let AppActions = Reflux.createActions({
  'nav': {asyncResult: true},
  'changeCollectorType': {asyncResult: true},

  // History
  'getHistoryPage': {asyncResult: true},
  'getHistoryCount': {asyncResult: true},
  'getHistoryPageCount': {asyncResult: true},
  'getHistory': {asyncResult: true},
  'setHistoryPageNo': {asyncResult: true},
  'setHistoryPageSize': {asyncResult: true},
  'setHistorySort': {asyncResult: true},
  'setHistoryLoadingFlag': {asyncResult: true},
  'setHistoryPager': {asyncResult: true},

  // Collecotr
  'getActiveCollectorList': {asyncResult: true},
  'saveActiveCollector': {asyncResult: true},
  'editActiveCollector': {asyncResult: true},
  'setActiveCollector': {asyncResult: true},
  'setActiveCollectorFlag': {asyncResult: true},
  'setActiveCollectorChecklist': {asyncResult: true},
  'deleteActiveCollector': {asyncResult: true},
  'setActiveCollectorDeleteModal': {asyncResult: true},
  'setActiveCollectorTime': {asyncResult: true},
  'updateActiveCollector': {asyncResult: true},

  'getPassiveCollectorList': {asyncResult: true},
  'savePassiveCollector': {asyncResult: true},
  'editPassiveCollector': {asyncResult: true},
  'setPassiveCollector': {asyncResult: true},
  'setPassiveCollectorFlag': {asyncResult: true},
  'setPassiveCollectorChecklist': {asyncResult: true},
  'deletePassiveCollector': {asyncResult: true},
  'setPassiveCollectorDeleteModal': {asyncResult: true},
  'updatePassiveCollector': {asyncResult: true},

  // Login
  'updateLoginUser': {asyncResult: true},
  'updateLoginPass': {asyncResult: true},
  'login': {asyncResult: true},
  'logout': {asyncResult: true},

  // Management
  'changeManagementPassword': {asyncResult: true},

  // status
  'changeStatusType': {asyncResult: true},
  'setCollectorSwitch': {asyncResult: true},
  'getActiveStatusList': {asyncResult: true},
  'getPassiveStatusList': {asyncResult: true}
})

export default AppActions