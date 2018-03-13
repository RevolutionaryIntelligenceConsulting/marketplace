import { connect } from 'react-redux'
import { getLocale, isConnecting } from 'modules/wallet/selectors'
import { getData } from 'modules/translation/selectors'
import { fetchTranslationsRequest } from 'modules/translation/actions'
import { getPreferredLanguage } from 'modules/translation/utils'
import Page from './Page'

const mapState = state => {
  let locale = getLocale(state)

  if (!isConnecting(state)) {
    locale = locale || getPreferredLanguage()
  }

  const translations = getData(state)[locale]

  return {
    locale,
    translations
  }
}

const mapDispatch = dispatch => ({
  onFetchTranslations: locale => dispatch(fetchTranslationsRequest(locale))
})

export default connect(mapState, mapDispatch)(Page)
