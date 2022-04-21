import { Map } from 'immutable'
import { combineReducers } from 'redux'
import type { ErrorsById, Id } from 'domain/error/entity/error'
import type { AcknowledgeErrorActionTypes } from 'domain/error/usecase/acknowledge-error/actionCreators'
import type { ClearErrorActionTypes } from 'domain/error/usecase/clear-error/actionCreators'
import type { ClearErrorsActionTypes } from 'domain/error/usecase/clear-errors/actionCreators'
import type { ReportErrorActionTypes } from 'domain/error/usecase/report-error/actionCreators'
import type { DeepReadonly } from 'superTypes'

const errors = (
  state: DeepReadonly<ErrorsById> = Map(),
  action: DeepReadonly<ReportErrorActionTypes | ClearErrorsActionTypes | ClearErrorActionTypes>
): ErrorsById => {
  switch (action.type) {
    case 'error/errorReported':
      return state.set(action.payload.error.id, action.payload.error)
    case 'error/errorsCleared':
      return state.clear()
    case 'error/errorCleared':
      return state.delete(action.payload.id)
    default:
      return state
  }
}

const unseenErrorId = (
  state: Id = '',
  action: DeepReadonly<ReportErrorActionTypes | AcknowledgeErrorActionTypes>
): Id => {
  switch (action.type) {
    case 'error/errorReported':
      return action.payload.error.id
    case 'error/errorAcknowledged':
      return ''
    default:
      return state
  }
}

const rootReducer = combineReducers({ errors, unseenErrorId })

export default rootReducer
