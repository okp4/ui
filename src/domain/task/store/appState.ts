import type { List } from 'immutable'
import type { Tasks } from '../entity/task'

export type AppState<T = string, I = string> = {
  task: {
    all: Tasks<T, I>
    byId: Map<I, number>
    byType: Map<I, List<number>>
  }
  unseenTaskId: I | null
}
