import short from 'short-uuid'
import { UnspecifiedError } from '../../entity/error'
import type { Task, TaskStatus } from '../../entity/task'
import { TaskBuilder } from './task.builder'

type Data = Readonly<
  Partial<{
    initialTask: Task
    id: string
    creationDate: Readonly<Date>
    lastUpdateDate: Readonly<Date>
    messageKey: string
    type: string
    initiator: string
    status: TaskStatus
  }> & {
    expectedStatus: boolean
  }
>

describe('Build a task', () => {
  const aDate = new Date(1995, 11, 17)
  const aBadDate = {}
  const fakedDate = new Date(2022, 1, 1)
  const fakedUuid = 'foobar'
  const baseStatus = 'processing'

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
    jest.useFakeTimers('modern')
    jest.setSystemTime(fakedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    initialTask           | id           | creationDate | lastUpdateDate | messageKey                  | type           | initiator | status          | expectedStatus
    ${undefined}          | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${true}
    ${undefined}          | ${'#id2'}    | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${undefined}    | ${true}
    ${undefined}          | ${'#id3'}    | ${aDate}     | ${undefined}   | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${true}
    ${undefined}          | ${undefined} | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${true}
    ${undefined}          | ${'#id5'}    | ${undefined} | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${true}
    ${undefined}          | ${''}        | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${false}
    ${undefined}          | ${'#id7'}    | ${aDate}     | ${aDate}       | ${''}                       | ${'test-task'} | ${'test'} | ${'processing'} | ${false}
    ${undefined}          | ${'#id8'}    | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${''}          | ${'test'} | ${'processing'} | ${false}
    ${{ messageKey: '' }} | ${'#id8'}    | ${undefined} | ${aDate}       | ${undefined}                | ${undefined}   | ${'test'} | ${'processing'} | ${false}
    ${undefined}          | ${'#id8'}    | ${aBadDate}  | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${false}
    ${undefined}          | ${'#id8'}    | ${aDate}     | ${aBadDate}    | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${'processing'} | ${false}
    ${undefined}          | ${'#id8'}    | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${''}     | ${'processing'} | ${false}
    ${undefined}          | ${'#id8'}    | ${aDate}     | ${aDate}       | ${'domain.task.processing'} | ${'test-task'} | ${'test'} | ${''}           | ${false}
  `(
    'Given that id is <$id>, creationDate is <$creationDate>, lastUpdateDate is <$lastUpdateDate>, messageKey is <$messageKey>, type is <$type>, initiator is <$initiator> and status is <$status>',
    ({
      initialTask,
      id,
      creationDate,
      lastUpdateDate,
      messageKey,
      type,
      initiator,
      status,
      expectedStatus
    }: Data) => {
      describe('When building a task', () => {
        const task = (): Task => {
          // eslint-disable-next-line functional/no-let
          let taskBuilder = new TaskBuilder(initialTask)

          if (id !== undefined) {
            taskBuilder = taskBuilder.withId(id)
          }
          if (creationDate !== undefined) {
            taskBuilder = taskBuilder.withCreationDate(creationDate)
          }
          if (lastUpdateDate !== undefined) {
            taskBuilder = taskBuilder.withLastUpdateDate(lastUpdateDate)
          }
          if (messageKey !== undefined) {
            taskBuilder = taskBuilder.withMessageKey(messageKey)
          }
          if (type !== undefined) {
            taskBuilder = taskBuilder.withType(type)
          }
          if (initiator !== undefined) {
            taskBuilder = taskBuilder.withInitiator(initiator)
          }
          if (status !== undefined) {
            taskBuilder = taskBuilder.withStatus(status)
          }
          return taskBuilder.build()
        }

        test(`Then, expect TaskBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(task()).toEqual({
              id: id === undefined ? fakedUuid : id,
              creationDate: creationDate === undefined ? fakedDate : creationDate,
              lastUpdateDate: lastUpdateDate === undefined ? fakedDate : lastUpdateDate,
              messageKey,
              type,
              initiator,
              status: status === undefined ? baseStatus : status
            })
          } else {
            expect(task).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
