import { Map, OrderedMap, OrderedSet } from 'immutable'
import { EventBus } from 'ts-bus'
import type { Task, TaskStatus } from 'domain/task/entity/task'
import type { AppState } from '../../store/appState'
import {
  getTaskStatusById,
  getTaskIdsByType,
  getDisplayedTaskIdsByTypeAndStatus
} from './task.selector'
import type { DeepReadonly } from 'superTypes'
import { TaskBuilder } from 'domain/task/builder/task.builder'
import { TaskStoreBuilder } from '../builder/store.builder'

type Data = DeepReadonly<{
  state: AppState
  taskId: string
  taskType: string
  taskStatus: TaskStatus
  expectedTaskStatus: ReturnType<typeof getTaskStatusById>
  expectedTaskIds: ReturnType<typeof getTaskIdsByType>
  exptectedDisplayedTaskIdsByTypeAndStatus: ReturnType<typeof getDisplayedTaskIdsByTypeAndStatus>
}>

const aDate = new Date(1995, 11, 17)
const bDate = new Date(1984, 10, 8)
const task1 = new TaskBuilder()
  .withId('#id-1')
  .withCreationDate(aDate)
  .withLastUpdateDate(aDate)
  .withType('foo')
  .withStatus('success')
  .withInitiator('domain:test')
  .build()
const task2 = new TaskBuilder()
  .withId('#id-2')
  .withCreationDate(bDate)
  .withLastUpdateDate(bDate)
  .withType('foo')
  .withStatus('error')
  .withInitiator('domain:test')
  .build()
const task3 = new TaskBuilder()
  .withId('#id-3')
  .withCreationDate(bDate)
  .withLastUpdateDate(bDate)
  .withType('bar')
  .withStatus('success')
  .withInitiator('domain:test')
  .build()

const state1: AppState = {
  task: {
    byId: OrderedMap<string, Task>().set(task1.id, task1).set(task2.id, task2).set(task3.id, task3),
    byType: OrderedMap<string, OrderedSet<string>>()
      .set(task1.type, OrderedSet<string>([task1.id, task2.id]))
      .set(task3.type, OrderedSet<string>([task3.id]))
  },
  displayedTaskIds: OrderedSet<string>([task1.id, task2.id])
}

describe.each`
  state        | taskId          | taskType         | taskStatus         | expectedTaskStatus | expectedTaskIds                             | exptectedDisplayedTaskIdsByTypeAndStatus
  ${undefined} | ${'#id-1'}      | ${undefined}     | ${undefined}       | ${undefined}       | ${undefined}                                | ${[]}
  ${state1}    | ${'#id-broken'} | ${'broken-type'} | ${'broken-status'} | ${undefined}       | ${undefined}                                | ${[]}
  ${state1}    | ${'#id-3'}      | ${'foo'}         | ${'success'}       | ${task3.status}    | ${OrderedSet<string>([task1.id, task2.id])} | ${[task1.id]}
`(
  'Given that state is <$state>, taskId is <$taskId>, taskType is <$taskType> and taskStatus is <$taskStatus>',
  ({
    state,
    taskId,
    taskType,
    taskStatus,
    expectedTaskStatus,
    expectedTaskIds,
    exptectedDisplayedTaskIdsByTypeAndStatus: exptectedDisplayedTaskIdByTypeAndStatus
  }: Data): void => {
    const store = () => {
      const eventBusInstance = new EventBus()
      let storeBuilder = new TaskStoreBuilder()
      if (state) {
        storeBuilder = storeBuilder.withPreloadedState(state)
      }
      return storeBuilder.withEventBus(eventBusInstance).build()
    }
    describe('When performing selection getTaskStatusById', () => {
      const v = getTaskStatusById(store().getState(), taskId)

      test(`Then, expect value to be ${expectedTaskStatus}`, () => {
        expect(v).toEqual(expectedTaskStatus)
      })
    })

    describe('When performing selection getTaskIdsByType', () => {
      const v = getTaskIdsByType(store().getState(), taskType)

      test(`Then, expect value to be ${expectedTaskIds}`, () => {
        expect(v).toEqual(expectedTaskIds)
      })
    })

    describe('When performing selection getDisplayedTaskIdsByTypeAndStatus', () => {
      const v = getDisplayedTaskIdsByTypeAndStatus(store().getState(), taskType, taskStatus)

      test(`Then, expect value to be ${exptectedDisplayedTaskIdByTypeAndStatus}`, () => {
        expect(v).toEqual(exptectedDisplayedTaskIdByTypeAndStatus)
      })
    })
  }
)
