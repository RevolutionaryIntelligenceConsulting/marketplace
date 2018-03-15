import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getWallet } from 'modules/wallet/selectors'
import { getLocation } from 'modules/location/selectors'
import { getCenter } from 'modules/ui/selectors'
import { isConnected } from 'modules/wallet/selectors'
import { getPendingTransactions } from 'modules/transaction/selectors'

import { getActivePage } from './utils'

import Navbar from './Navbar'

const mapState = state => {
  const wallet = getWallet(state)
  const { pathname } = getLocation(state)
  const activePage = getActivePage({ wallet, pathname })
  const center = getCenter(state)
  return {
    activePage,
    wallet,
    center,
    isConnected: isConnected(state),
    activityBadge: getPendingTransactions(state).length
  }
}

const mapDispatch = dispatch => ({
  onNavigate: url => dispatch(push(url))
})

export default connect(mapState, mapDispatch)(Navbar)
