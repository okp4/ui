import short from 'short-uuid'
import { UnspecifiedError } from '../entity/error'
import type { Task, TaskProgress, TaskStatus } from '../entity/task'
import { TaskBuilder } from './task.builder'

type Data = Readonly<
  Partial<{
    initialTask: Task
    id: string
    creationDate: Readonly<Date>
    lastUpdateDate: Readonly<Date>
    type: string
    initiator: string
    status: TaskStatus
    progress?: TaskProgress
  }> & {
    expectedStatus: boolean
  }
>

describe('Build a task', () => {
  const aDate = new Date(1995, 11, 17)
  const aBadDate = {}
  const fakedDate = new Date('2021-01-01T09:00:00.000Z')
  const fakedUuid = 'foobar'
  const baseStatus = 'processing'

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
  })

  describe.each`
    initialTask     | id           | creationDate | lastUpdateDate | type           | initiator | status          | progress                                   | expectedStatus
    ${undefined}    | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${true}
    ${undefined}    | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${{ max: 1234567, min: 0, current: 5678 }} | ${true}
    ${undefined}    | ${'#id2'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${undefined}    | ${undefined}                               | ${true}
    ${undefined}    | ${'#id3'}    | ${aDate}     | ${undefined}   | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${true}
    ${undefined}    | ${undefined} | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${true}
    ${undefined}    | ${'#id4'}    | ${undefined} | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${true}
    ${undefined}    | ${''}        | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${false}
    ${undefined}    | ${'#id5'}    | ${aDate}     | ${aDate}       | ${''}          | ${'test'} | ${'processing'} | ${undefined}                               | ${false}
    ${{ type: '' }} | ${'#id6'}    | ${undefined} | ${aDate}       | ${undefined}   | ${'test'} | ${'processing'} | ${undefined}                               | ${false}
    ${undefined}    | ${'#id7'}    | ${aBadDate}  | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${false}
    ${undefined}    | ${'#id8'}    | ${aDate}     | ${aBadDate}    | ${'test-task'} | ${'test'} | ${'processing'} | ${undefined}                               | ${false}
    ${undefined}    | ${'#id9'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${''}     | ${'processing'} | ${undefined}                               | ${false}
    ${undefined}    | ${'#id10'}   | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${''}           | ${undefined}                               | ${false}
    ${undefined}    | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${{ max: 123, min: 0, current: 1234 }}     | ${false}
    ${undefined}    | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${{ max: 8, min: 10, current: 7 }}         | ${false}
    ${undefined}    | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${{ max: 100, min: 100, current: 7 }}      | ${false}
    ${undefined}    | ${'#id1'}    | ${aDate}     | ${aDate}       | ${'test-task'} | ${'test'} | ${'processing'} | ${{ max: 100, min: 0, current: -10 }}      | ${false}
  `(
    'Given that id is <$id>, creationDate is <$creationDate>, lastUpdateDate is <$lastUpdateDate>, type is <$type>, initiator is <$initiator> and status is <$status>',
    ({
      initialTask,
      id,
      creationDate,
      lastUpdateDate,
      type,
      initiator,
      status,
      progress,
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
          if (type !== undefined) {
            taskBuilder = taskBuilder.withType(type)
          }
          if (initiator !== undefined) {
            taskBuilder = taskBuilder.withInitiator(initiator)
          }
          if (status !== undefined) {
            taskBuilder = taskBuilder.withStatus(status)
          }
          if (progress !== undefined) {
            taskBuilder = taskBuilder.withProgress(progress)
          }
          return taskBuilder.build()
        }

        test(`Then, expect TaskBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(task()).toEqual({
              id: id === undefined ? fakedUuid : id,
              creationDate: creationDate === undefined ? fakedDate : creationDate,
              lastUpdateDate: lastUpdateDate === undefined ? fakedDate : lastUpdateDate,
              type,
              initiator,
              status: status === undefined ? baseStatus : status,
              progress
            })
          } else {
            expect(task).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
