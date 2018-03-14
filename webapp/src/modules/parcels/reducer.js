import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  FETCH_PARCEL_REQUEST,
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCEL_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE
} from './actions'
import { FETCH_ADDRESS_PARCELS_SUCCESS } from 'modules/address/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { cleanParcel, toParcelObject } from './utils'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function parcelsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCEL_REQUEST:
    case FETCH_PARCELS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PARCEL_SUCCESS: {
      const parcelId = action.parcel.id
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [parcelId]: cleanParcel(action.parcel, state.data)
        }
      }
    }
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    }
    case FETCH_PARCEL_FAILURE:
    case FETCH_PARCELS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_ADDRESS_PARCELS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    }
    case EDIT_PARCEL_REQUEST: {
      const parcelId = action.parcel.id
      const parcel = state.data[parcelId]
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcelId]: { ...parcel }
        }
      }
    }
    case EDIT_PARCEL_SUCCESS:
    case EDIT_PARCEL_FAILURE: {
      const { parcel } = action
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcel.id]: { ...parcel }
        }
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case TRANSFER_PARCEL_SUCCESS: {
          const { parcelId, newOwner } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [parcelId]: {
                ...state.data[parcelId],
                owner: newOwner.toLowerCase()
              }
            }
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}
