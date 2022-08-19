import { OrderedMap, OrderedSet } from 'immutable'
import type { Store, AnyAction } from 'redux'
import { EventBus } from 'ts-bus'
import { UnspecifiedError } from 'domain/file/entity/error'
import { FileStoreBuilder } from './store.builder'
import type { FileStoreParameters } from './store.builder'
import type { AppState } from '../appState'
import { FileBuilder } from 'domain/file/builder/file.builder'
import { FileEntity } from 'domain/file/entity/file'

type Data = Readonly<
  Partial<{
    initialStoreParamters: FileStoreParameters
    eventBus: EventBus
    preloadedState: AppState
  }> & {
    expectedStatus: boolean
  }
>
const eventBusInstance = new EventBus()
const file1 = new FileBuilder()
  .withId('id1')
  .withName('image1')
  .withSize(100)
  .withType('image/png')
  .withStream(new ReadableStream())
  .build()

const state1: AppState = {
  file: {
    byId: OrderedMap<string, FileEntity>().set(file1.id, file1),
    byType: OrderedMap<string, OrderedSet<string>>().set(file1.type, OrderedSet<string>([file1.id]))
  }
}

describe('Build a File store', () => {
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
      describe('When building a File Store', () => {
        const store = (): Store<AppState, AnyAction> => {
          // eslint-disable-next-line functional/no-let
          let fileStoreBuilder = new FileStoreBuilder(initialStoreParamters)

          if (eventBus !== undefined) {
            fileStoreBuilder = fileStoreBuilder.withEventBus(eventBus)
          }
          if (preloadedState !== undefined) {
            fileStoreBuilder = fileStoreBuilder.withPreloadedState(preloadedState)
          }
          return fileStoreBuilder.build()
        }

        test(`Then, expect FileStoreBuilder to ${expectedStatus ? 'succeed' : 'fail'}`, () => {
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
