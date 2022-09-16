import { List as ImmutableList } from 'immutable'
import { HTTPFaucetGateway } from 'adapters/faucet/secondary/graphql/HTTPFaucetGateway'
import { KeplrWalletGateway } from 'adapters/wallet/secondary/KeplrWalletGateway'
import { WalletRegistryGateway } from 'adapters/wallet/secondary/WalletRegistryGateway'
import { ErrorContext } from 'context/storeContext/errorContext'
import { FaucetContext } from 'context/storeContext/faucetContext'
import { TaskContext } from 'context/storeContext/taskContext'
import { WalletContext } from 'context/storeContext/walletContext'
import { ErrorStoreBuilder } from 'domain/error/store/builder/store.builder'
import { FaucetStoreBuilder } from 'domain/faucet/store/builder/store.builder'
import { TaskStoreBuilder } from 'domain/task/store/builder/store.builder'
import { WalletStoreBuilder } from 'domain/wallet/store/builder/store.builder'
import { createEventBusInstance } from 'eventBus/index'
import type { StoreParameter } from 'ui/providers/storeProvider'
import * as env from './env.json'
import 'domain/error/index'

const eventBusInstance = createEventBusInstance()

// Faucet
const faucetGateway = new HTTPFaucetGateway(env.faucetUrl)
const faucetStore = new FaucetStoreBuilder()
  .withEventBus(eventBusInstance)
  .withDependencies({ faucetGateway })
  .build()
const faucetStoreParameter: StoreParameter = [FaucetContext, faucetStore]

// Error
const errorStore = new ErrorStoreBuilder().withEventBus(eventBusInstance).build()
const errorStoreParameter: StoreParameter = [ErrorContext, errorStore]

// Task
const taskStore = new TaskStoreBuilder().withEventBus(eventBusInstance).build()
const taskStoreParameter: StoreParameter = [TaskContext, taskStore]

// Wallet
const walletRegistryGateway = new WalletRegistryGateway()
const keplrGateway = new KeplrWalletGateway(env.keplrChainInfo)
walletRegistryGateway.register(keplrGateway)
const walletStore = new WalletStoreBuilder()
  .withEventBus(eventBusInstance)
  .withDependencies({ walletRegistryGateway })
  .build()
const walletStoreParameter: StoreParameter = [WalletContext, walletStore]

export default ImmutableList([
  faucetStoreParameter,
  errorStoreParameter,
  walletStoreParameter,
  taskStoreParameter
])
