import React, { useCallback } from 'react'
import keplrImage from '../../../../assets/images/keplr.png'
import { acknowledgeError } from 'domain/error/usecase/acknowledge-error/acknowledgeError'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import { requestFunds } from 'domain/faucet/usecase/request-funds/requestFunds'
import { enableWallet } from 'domain/wallet/usecases/enable-wallet/enableWallet'
import { useErrorSelector, useErrorDispatch } from 'hook/storeHook/errorHook'
import { useFaucetDispatch, useFaucetSelector } from 'hook/storeHook/faucetHook'
import { useWalletDispatch } from 'hook/storeHook/walletHook'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { hasUnseenError, unseenErrorMessage } from 'domain/error/store/selector/error.selector'
import { Button } from 'ui/atoms/button/Button'
import { TextField } from 'ui/atoms/textField/TextField'
import { Toast } from 'ui/atoms/toast/Toast'
import { Typography } from 'ui/atoms/typography/Typography'
import type { DeepReadonly } from 'superTypes'
import '../i18n/index'
import './faucet.scss'

export type FaucetProps = Readonly<{
  chainId: string
}>

// JSX function
// eslint-disable-next-line max-lines-per-function
export const Faucet: React.FC<FaucetProps> = ({ chainId }: FaucetProps) => {
  const faucetDispatch = useFaucetDispatch()
  const walletDispatch = useWalletDispatch()
  const errorDispatch = useErrorDispatch()
  const { t }: UseTranslationResponse = useTranslation()
  const address = useFaucetSelector((state: DeepReadonly<FaucetAppState>) => state.address)
  const hasTransactionError = useErrorSelector(hasUnseenError)
  const errorMessage = useErrorSelector(unseenErrorMessage)

  const acknowledgeFaucetError = useCallback(() => {
    errorDispatch(acknowledgeError())
  }, [errorDispatch])

  const handleClose = useCallback(() => {
    acknowledgeFaucetError()
  }, [acknowledgeFaucetError])

  const handleAddressChange = useCallback(
    // readonly recursivity on a DOM event is not a good idea...
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault()
      event.stopPropagation()
      faucetDispatch(setAddress(event.target.value))
    },
    [faucetDispatch]
  )

  const handleRequestWithAddress = useCallback(async () => {
    hasTransactionError && (await acknowledgeFaucetError())
    faucetDispatch(setAddress(''))
    faucetDispatch(requestFunds(address))
  }, [acknowledgeFaucetError, address, faucetDispatch, hasTransactionError])

  const handleRequestWithWallet = useCallback(() => {
    hasTransactionError && acknowledgeFaucetError()
    walletDispatch(enableWallet('keplr', chainId))
  }, [acknowledgeFaucetError, chainId, hasTransactionError, walletDispatch])

  return (
    <div className="okp4-faucet-main">
      <div className="okp4-faucet-content">
        <div className="okp4-faucet-content-brand-main">
          <div>
            <Typography color="text" fontSize="large" fontWeight="bold">
              {t('faucet:faucet.brand.title')}
            </Typography>
          </div>
          <div>
            <Typography color="text" fontSize="small" fontWeight="light">
              {t('faucet:faucet.brand.description')}
            </Typography>
          </div>
        </div>
        <div className="okp4-faucet-content-action-main">
          <div className="okp4-faucet-content-action-item">
            <Typography color="text" fontFamily="secondary" fontSize="small" fontWeight="bold">
              {t('faucet:faucet.requestFundsWithKeplr')}
            </Typography>
            <img alt="Keplr logo" src={keplrImage} />
            <Button
              label={t('faucet:faucet.sendMeToken')}
              onClick={handleRequestWithWallet}
              size="large"
              variant="secondary"
            />
          </div>
          <div className="okp4-faucet-content-action-item">
            <Typography color="text" fontFamily="secondary" fontSize="small" fontWeight="bold">
              {t('faucet:faucet.requestFundsWithAddress')}
            </Typography>
            <TextField
              onChange={handleAddressChange}
              placeholder={t('faucet:faucet.addressPlaceholder')}
              size="small"
              value={address}
            />
            <Button
              label={t('faucet:faucet.sendMeToken')}
              onClick={handleRequestWithAddress}
              size="large"
              variant="secondary"
            />
          </div>
        </div>
        <div className="okp4-faucet-content-info-main">
          <div>
            <Typography color="text" fontSize="x-small" fontWeight="bold">
              {t('faucet:faucet.info.limitation')}
            </Typography>
          </div>
          <div>
            <Typography color="text" fontSize="x-small" fontWeight="light">
              {t('faucet:faucet.info.description')}
            </Typography>
          </div>
        </div>
      </div>
      <Toast
        autoDuration={3000}
        description={
          errorMessage
            ? t(`errorDomain:${errorMessage}`)
            : t('errorDomain:domain.error.unspecified-error')
        }
        isOpened={hasTransactionError}
        onOpenChange={handleClose}
        severityLevel="error"
        title={t('faucet:faucet.common.error')}
      />
    </div>
  )
}
