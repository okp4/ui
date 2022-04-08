import React, { useCallback } from 'react'
import {
  useFaucetStore,
  useFaucetDispatch,
  useFaucetSelector,
  useWalletStore,
  useWalletSelector
} from '../store/index'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import { requestFunds } from 'domain/faucet/usecase/request-funds/requestFunds'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import type { AppState as WalletAppState } from 'domain/wallet/store/appState'
import { retrieveAddress } from 'saga/retrieve-address/retrieveAddress'
import type { DeepReadonly } from 'superTypes'
import { Logo } from 'ui/atoms/logo/Logo'
import { Text } from 'ui/atoms/text/Text'
import { TextInput } from 'ui/atoms/textInput/TextInput'
import { ThemeSwitcher } from 'ui/atoms/theme/ThemeSwitcher'

import './faucetView.scss'

type FaucetViewProps = Readonly<{
  chainId: string
}>

export const FaucetView: React.FC<FaucetViewProps> = ({ chainId }: FaucetViewProps) => {
  const walletStore = useWalletStore()
  const faucetStore = useFaucetStore()
  const faucetDispatch = useFaucetDispatch()
  const address = useFaucetSelector((state: DeepReadonly<FaucetAppState>) => state.address)
  const requestError = useFaucetSelector((state: DeepReadonly<FaucetAppState>) => state.error)
  const walletConnectionStatus = useWalletSelector(
    (state: DeepReadonly<WalletAppState>) => state.connectionStatuses
  )
  const walletAddress = useWalletSelector(
    (state: DeepReadonly<WalletAppState>) => state.accounts.get(chainId)?.get(0)?.address
  )

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault()
      event.stopPropagation()
      faucetDispatch(setAddress(event.target.value))
    },
    [faucetDispatch]
  )

  const handleSubmit = useCallback((): void => {
    faucetDispatch(requestFunds(address))
    faucetDispatch(setAddress(''))
  }, [address, faucetDispatch])

  const handleConnect = useCallback(() => {
    retrieveAddress('keplr', chainId, { walletStore, faucetStore })
  }, [chainId, faucetStore, walletStore])

  const isWalletConnected = (): boolean => walletConnectionStatus.get(chainId, '') === 'connected'

  return (
    <div className="okp4-faucet-main">
      <div className="okp4-faucet-header">
        <Logo size="small" />
        <div className="okp4-faucet-header-right">
          <ThemeSwitcher />
          <Text color="highlighted-text" fontWeight="bold" size="small">
            Christophe Camel
          </Text>
          {isWalletConnected() ? (
            <Text color="highlighted-text" fontWeight="bold" size="x-small">
              {walletAddress}
            </Text>
          ) : (
            <button className="action-button" onClick={handleConnect}>
              <Text color="highlighted-text" fontWeight="bold" size="x-small">
                Connect
              </Text>
            </button>
          )}
        </div>
      </div>
      <div className="okp4-faucet-content">
        <Text color="highlighted-text" fontWeight="bold" size="large">
          ØKP4 Faucet
        </Text>
        <div className="okp4-faucet-content-action">
          <TextInput
            error={requestError !== null}
            helperText={requestError?.message ?? undefined}
            onChange={handleChange}
            placeholder="ØKP4 address"
            size="medium"
            value={address}
          />
          <button className="action-button" disabled={!address} onClick={handleSubmit}>
            <Text color="highlighted-text" fontWeight="bold" size="x-small">
              Submit
            </Text>
          </button>
        </div>
      </div>
    </div>
  )
}
