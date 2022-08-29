import short from 'short-uuid'
import { UnspecifiedError } from '../../entity/error'
import type { TaskStatus, UpdateTask } from '../../entity/task'
import { UpdateTaskBuilder } from './updateTask.builder'

type Data = Readonly<
  Partial<{
    initialUpdateTask: UpdateTask
    id: string
    lastUpdateDate: Readonly<Date>
    messageKey: string
    status: TaskStatus
  }> & {
    expectedStatus: boolean
  }
>

describe('Build an updateTask', () => {
  const aDate = new Date(1995, 11, 17)
  const aBadDate = {}
  const fakedDate = new Date(2022, 1, 1)
  const fakedUuid = 'foobar'

  beforeAll(() => {
    short.generate = jest.fn(() => fakedUuid as short.SUUID)
    jest.useFakeTimers()
    jest.setSystemTime(fakedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe.each`
    initialUpdateTask     | id           | lastUpdateDate | messageKey                  | status       | expectedStatus
    ${undefined}          | ${'#id1'}    | ${aDate}       | ${'domain.task.processing'} | ${'success'} | ${true}
    ${undefined}          | ${'#id2'}    | ${aDate}       | ${'domain.task.processing'} | ${undefined} | ${true}
    ${undefined}          | ${'#id3'}    | ${undefined}   | ${'domain.task.processing'} | ${'success'} | ${true}
    ${undefined}          | ${'#id4'}    | ${aDate}       | ${undefined}                | ${'success'} | ${true}
    ${undefined}          | ${undefined} | ${aDate}       | ${'domain.task.processing'} | ${'success'} | ${false}
    ${undefined}          | ${''}        | ${aDate}       | ${'domain.task.processing'} | ${'success'} | ${false}
    ${undefined}          | ${'#id5'}    | ${aDate}       | ${''}                       | ${'success'} | ${false}
    ${{ messageKey: '' }} | ${'#id6'}    | ${undefined}   | ${undefined}                | ${'success'} | ${false}
    ${undefined}          | ${'#id7'}    | ${aBadDate}    | ${'domain.task.processing'} | ${'success'} | ${false}
    ${undefined}          | ${'#id8'}    | ${aDate}       | ${'domain.task.processing'} | ${''}        | ${false}
  `(
    'Given that id is <$id>, lastUpdateDate is <$lastUpdateDate>, messageKey is <$messageKey> and status is <$status>',
    ({ initialUpdateTask, id, lastUpdateDate, messageKey, status, expectedStatus }: Data) => {
      describe('When building an updateTask', () => {
        const updateTask = (): UpdateTask => {
          // eslint-disable-next-line functional/no-let
          let updateTaskBuilder = new UpdateTaskBuilder(initialUpdateTask)

          if (id !== undefined) {
            updateTaskBuilder = updateTaskBuilder.withId(id)
          }
          if (lastUpdateDate !== undefined) {
            updateTaskBuilder = updateTaskBuilder.withLastUpdateDate(lastUpdateDate)
          }
          if (messageKey !== undefined) {
            updateTaskBuilder = updateTaskBuilder.withMessageKey(messageKey)
          }
          if (status !== undefined) {
            updateTaskBuilder = updateTaskBuilder.withStatus(status)
          }
          return updateTaskBuilder.build()
        }

        test(`Then, expect UpdateTaskBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
          if (expectedStatus) {
            expect(updateTask()).toEqual({
              id: id === undefined ? fakedUuid : id,
              lastUpdateDate: lastUpdateDate === undefined ? fakedDate : lastUpdateDate,
              messageKey,
              status
            })
          } else {
            expect(updateTask).toThrowError(UnspecifiedError)
          }
        })
      })
    }
  )
})
