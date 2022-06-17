import { OrderedMap, OrderedSet } from 'immutable'
import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { UnspecifiedError } from 'domain/task/entity/error'
import { TaskStoreBuilder } from './store.builder'
import type { TaskStoreParameters } from './store.builder'
import type { AppState } from '../appState'
import { TaskBuilder } from 'domain/task/builder/task/task.builder'
import { Task } from 'domain/task/entity/task'

type Data = Readonly<
  Partial<{
    initialStoreParamters: TaskStoreParameters
    eventBus: EventBus
    preloadedState: AppState
  }> & {
    expectedStatus: boolean
  }
>
const eventBusInstance = new EventBus()
const task1 = new TaskBuilder()
  .withId('id1')
  .withCreationDate(new Date())
  .withLastUpdateDate(new Date())
  .withMessageKey('domain.task.test')
  .withType('task-test')
  .withStatus('processing')
  .build()

const state1: AppState = {
  task: {
    byId: OrderedMap<string, Task>().set(task1.id, task1),
    byType: OrderedMap<string, OrderedSet<string>>().set(task1.type, OrderedSet<string>([task1.id]))
  },
  displayedTaskIds: OrderedSet<string>([task1.id])
}

describe('Build a Task store', () => {
  describe.each`
    initialStoreParamters             | eventBus            | preloadedState | expectedStatus
    ${undefined}                      | ${eventBusInstance} | ${undefined}   | ${true}
    ${undefined}                      | ${eventBusInstance} | ${state1}      | ${true}
    ${{ eventBus: eventBusInstance }} | ${undefined}        | ${undefined}   | ${true}
    ${undefined}                      | ${eventBusInstance} | ${{}}          | ${false}
    ${undefined}                      | ${{}}               | ${undefined}   | ${false}
    ${undefined}                      | ${undefined}        | ${undefined}   | ${false}
    ${{ preloadedState: {} }}         | ${undefined}        | ${undefined}   | ${false}
    ${{ eventBus: {} }}               | ${undefined}        | ${undefined}   | ${false}
  `(
    'Given that eventBus is <$eventBus> adn preloadedState is <$preloadedState>',
    ({ initialStoreParamters, eventBus, preloadedState, expectedStatus }: Data) => {
      describe('When building a Task Store', () => {
        const store = (): Store<AppState, AnyAction> => {
          // eslint-disable-next-line functional/no-let
          let taskStoreBuilder = new TaskStoreBuilder(initialStoreParamters)

          if (eventBus !== undefined) {
            taskStoreBuilder = taskStoreBuilder.withEventBus(eventBus)
          }
          if (preloadedState !== undefined) {
            taskStoreBuilder = taskStoreBuilder.withPreloadedState(preloadedState)
          }
          return taskStoreBuilder.build()
        }

        test(`Then, expect TaskStoreBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(store()).toBeDefined()
            expect(store()).toHaveProperty('dispatch')
            if (preloadedState) {
              expect(store().getState()).toStrictEqual(state1)
            }
          } else {
            expect(store).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
