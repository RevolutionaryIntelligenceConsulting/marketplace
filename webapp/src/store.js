import { compose, createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { env } from 'decentraland-commons'

import createHistory from 'history/createBrowserHistory'
import createSagasMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { api } from 'lib/api'

import { createTransactionMiddleware } from 'modules/transaction/middleware'
import { createGoogleAnalyticsMiddleware } from 'modules/analytics/middleware'
import { createStorageMiddleware } from 'modules/storage/middleware'

import { analyticsReduceer } from 'modules/analytics/reducer'
import { rootReducer } from './reducer'
import { rootSaga } from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createHistory()

const historyMiddleware = routerMiddleware(history)
const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({
  predicate: (_, action) =>
    env.isDevelopment() || action.type.includes('Failure'),
  collapsed: () => true
})
const transactionMiddleware = createTransactionMiddleware()
const analyticsMiddleware = createGoogleAnalyticsMiddleware(analyticsReduceer)
const storageMiddleware = createStorageMiddleware(
  env.get('REACT_APP_LOCAL_STORAGE_KEY', 'decentraland-marketplace')
)

const middleware = applyMiddleware(
  thunk.withExtraArgument(api),
  storageMiddleware,
  historyMiddleware,
  sagasMiddleware,
  loggerMiddleware,
  transactionMiddleware,
  analyticsMiddleware
)
const enhancer = composeEnhancers(middleware)
const store = createStore(rootReducer, enhancer)

sagasMiddleware.run(rootSaga)
storageMiddleware.load(store)

export function dispatch(action) {
  if (typeof action === 'string') {
    store.dispatch({ type: action })
  } else {
    store.dispatch(action)
  }
}

export function getState() {
  return store.getState()
}

if (env.isDevelopment()) {
  window.getState = store.getState
}

export { history, store }
