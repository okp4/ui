import { OrderedSet, OrderedMap } from 'immutable'
import { EventBus } from 'ts-bus'
import { removeFiles } from './removeFiles'
import type { ReduxStore } from '../../store/store'
import { FileBuilder } from 'domain/file/builder/file.builder'
import type { FileEntity } from 'domain/file/entity/file'
import { FileStoreBuilder } from 'domain/file/store/builder/store.builder'
import { AppState } from 'domain/file/store/appState'

const file1 = new FileBuilder()
  .withId('id1')
  .withName('image1')
  .withSize(100)
  .withType('image/png')
  .withStream(new ReadableStream())
  .build()

const file2 = new FileBuilder()
  .withId('id2')
  .withName('report1')
  .withSize(1000)
  .withType('csv')
  .withStream(new ReadableStream())
  .build()

const initialState: AppState = {
  file: {
    byId: OrderedMap<string, FileEntity>().set(file1.id, file1).set(file2.id, file2),
    byType: OrderedMap<string, OrderedSet<string>>()
      .set(file1.type, OrderedSet<string>().add(file1.id))
      .set(file2.type, OrderedSet<string>().add(file2.id))
  }
}

const eventBusInstance = new EventBus()
const store: ReduxStore = new FileStoreBuilder()
  .withEventBus(eventBusInstance)
  .withPreloadedState(initialState)
  .build()

describe('Remove all files', () => {
  it('should remove all files from store', async () => {
    await store.dispatch(removeFiles())
    expect(store.getState()).toEqual({
      file: {
        byId: OrderedMap<string, FileEntity>(),
        byType: OrderedMap<string, OrderedSet<string>>()
      }
    })
  })
})
