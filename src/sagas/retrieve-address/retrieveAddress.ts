import type { ReduxStore as WalletReduxStore } from 'domain/wallet/store/store'
import type { ReduxStore as FaucetReduxStore } from 'domain/faucet/store/store'
import { enableWallet } from 'domain/wallet/usecases/enable-wallet/enableWallet'
import type { ChainId } from 'domain/wallet/entities/wallet'
import type { WalletId } from 'domain/wallet/ports/walletPort'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import type { DeepReadonly } from '../../superTypes'

type Store = DeepReadonly<{
  walletStore: WalletReduxStore
  faucetStore: FaucetReduxStore
}>

export const retrieveAddress = async (
  walletId: WalletId,
  chainId: ChainId,
  { walletStore, faucetStore }: Store
): Promise<void> => {
  const address = await walletStore.dispatch(enableWallet(walletId, chainId))
  if (address) {
    faucetStore.dispatch(setAddress(address))
  }
}
