import React, { useCallback, useState } from 'react'
import keplrImage from 'assets/images/keplr.png'
import { acknowledgeError } from 'domain/error/usecase/acknowledge-error/acknowledgeError'
import type { AppState as FaucetAppState } from 'domain/faucet/store/appState'
import type { AppState as TaskAppState } from 'domain/task/store/appState'
import { setAddress } from 'domain/faucet/usecase/set-address/setAddress'
import { requestFunds, faucetTaskType } from 'domain/faucet/usecase/request-funds/requestFunds'
import { acknowledgeTask } from 'domain/task/usecase/acknowledge-task/acknowledgeTask'
import { enableWallet } from 'domain/wallet/usecases/enable-wallet/enableWallet'
import { useErrorSelector, useErrorDispatch } from 'hook/storeHook/errorHook'
import { useFaucetDispatch, useFaucetSelector } from 'hook/storeHook/faucetHook'
import { useTaskSelector, useTaskDispatch } from 'hook/storeHook/taskHook'
import { useWalletDispatch } from 'hook/storeHook/walletHook'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import { useTheme } from 'hook/useTheme'
import type { ThemeContextType } from 'context/themeContext'
import { hasUnseenError, unseenErrorMessage } from 'domain/error/store/selector/error.selector'
import { getDisplayedTaskIdsByTypeAndStatus } from 'domain/task/store/selector/task.selector'
import { Button } from 'ui/atoms/button/Button'
import { TextField } from 'ui/atoms/textField/TextField'
import { Toast } from 'ui/atoms/toast/Toast'
import { Typography } from 'ui/atoms/typography/Typography'
import { GReCaptcha } from 'ui/atoms/grecaptcha/Grecaptcha'
import type { DeepReadonly, UseState } from 'superTypes'
import './i18n/index'
import './faucet.scss'

type ActionItemProps = {
  onClick: () => void
}

type AdressActionItemProps = ActionItemProps
type WalletActionItemProps = ActionItemProps

type Recaptcha = {
  siteKey: string
  theme?: 'light' | 'dark'
}

export type FaucetProps = Readonly<{
  chainId: string
  recaptcha?: Recaptcha
}>

type Initiator = 'wallet' | 'input' | null

// JSX function
// eslint-disable-next-line max-lines-per-function
export const Faucet: React.FC<FaucetProps> = ({
  chainId,
  recaptcha
}: DeepReadonly<FaucetProps>) => {
  const { theme: contextTheme }: ThemeContextType = useTheme()
  const [initiator, setInitiator]: UseState<Initiator> = useState<Initiator>(null)
  const [walletRecaptcha, setWalletRecaptcha]: UseState<boolean> = useState<boolean>(false)
  const [addressRecaptcha, setAddressRecaptcha]: UseState<boolean> = useState<boolean>(false)
  const faucetDispatch = useFaucetDispatch()
  const walletDispatch = useWalletDispatch()
  const errorDispatch = useErrorDispatch()
  const taskDispatch = useTaskDispatch()
  const env = chainId.split('-')[1]
  const { t }: UseTranslationResponse = useTranslation()
  const address = useFaucetSelector((state: DeepReadonly<FaucetAppState>) => state.address)
  const hasTransactionError = useErrorSelector(hasUnseenError)
  const errorMessage = useErrorSelector(unseenErrorMessage)
  const transactionSuccessId = useTaskSelector(
    (state: DeepReadonly<TaskAppState>) =>
      getDisplayedTaskIdsByTypeAndStatus(state, faucetTaskType, 'success')[0]
  )
  const transactionLoading = useTaskSelector(
    (state: DeepReadonly<TaskAppState>) =>
      getDisplayedTaskIdsByTypeAndStatus(state, faucetTaskType, 'processing')[0]
  )

  const acknowledgeFaucetError = useCallback(() => {
    errorDispatch(acknowledgeError())
  }, [errorDispatch])

  const acknowledgeFaucetTask = useCallback(() => {
    transactionSuccessId && taskDispatch(acknowledgeTask({ id: transactionSuccessId }))
  }, [taskDispatch, transactionSuccessId])

  const cleanUIStates = useCallback(async () => {
    setInitiator(null)
    hasTransactionError && acknowledgeFaucetError()
    acknowledgeFaucetTask()
  }, [acknowledgeFaucetError, acknowledgeFaucetTask, hasTransactionError])

  const handleAddressChange = useCallback(
    // readonly recursivity on a DOM event is not a good idea...
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event.preventDefault()
      event.stopPropagation()
      faucetDispatch(setAddress(event.target.value))
    },
    [faucetDispatch]
  )

  const handleAdressButton = useCallback(() => {
    setAddressRecaptcha(true)
  }, [])

  const addressRequest = useCallback(async () => {
    setAddressRecaptcha(false)
    await cleanUIStates()
    setInitiator('input')
    faucetDispatch(setAddress(''))
    faucetDispatch(requestFunds(address))
  }, [address, faucetDispatch, cleanUIStates])

  const handleWalletButton = useCallback(() => {
    setWalletRecaptcha(true)
  }, [])

  const walletRequest = useCallback(async () => {
    setWalletRecaptcha(false)
    await cleanUIStates()
    setInitiator('wallet')
    walletDispatch(enableWallet('keplr', chainId))
  }, [chainId, cleanUIStates, setWalletRecaptcha, walletDispatch])

  const AdressActionItem: React.FC<AdressActionItemProps> = ({
    onClick
  }: Readonly<AdressActionItemProps>) => (
    <>
      <TextField
        onChange={handleAddressChange}
        placeholder={t('faucet:faucet.addressPlaceholder')}
        size="small"
        value={address}
      />
      {transactionLoading && initiator === 'input' ? (
        <div className="okp4-faucet-loader" />
      ) : (
        <Button
          disabled={!!transactionLoading}
          label={t('faucet:faucet.sendMeToken')}
          onClick={onClick}
          size="large"
          variant="secondary"
        />
      )}
    </>
  )
  const WalletActionItem: React.FC<WalletActionItemProps> = ({
    onClick
  }: Readonly<WalletActionItemProps>) => (
    <>
      <img alt="Keplr logo" src={keplrImage} />
      {transactionLoading && initiator === 'wallet' ? (
        <div className="okp4-faucet-loader" />
      ) : (
        <Button
          disabled={!!transactionLoading}
          label={t('faucet:faucet.sendMeToken')}
          onClick={onClick}
          size="large"
          variant="secondary"
        />
      )}
    </>
  )

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
              {t('faucet:faucet.brand.description', { env })}
            </Typography>
          </div>
        </div>
        <div className="okp4-faucet-content-action-main">
          <div className="okp4-faucet-content-action-item">
            <Typography color="text" fontFamily="secondary" fontSize="small" fontWeight="bold">
              {t('faucet:faucet.requestFundsWithKeplr')}
            </Typography>

            {recaptcha ? (
              walletRecaptcha ? (
                <GReCaptcha
                  onSuccess={walletRequest}
                  sitekey={recaptcha.siteKey}
                  theme={recaptcha.theme ?? contextTheme}
                />
              ) : (
                <WalletActionItem onClick={handleWalletButton} />
              )
            ) : (
              <WalletActionItem onClick={walletRequest} />
            )}
          </div>
          <div className="okp4-faucet-content-action-item">
            <Typography color="text" fontFamily="secondary" fontSize="small" fontWeight="bold">
              {t('faucet:faucet.requestFundsWithAddress')}
            </Typography>
            {recaptcha ? (
              addressRecaptcha ? (
                <GReCaptcha
                  onSuccess={addressRequest}
                  sitekey={recaptcha.siteKey}
                  theme={recaptcha.theme ?? contextTheme}
                />
              ) : (
                <AdressActionItem onClick={handleAdressButton} />
              )
            ) : (
              <AdressActionItem onClick={addressRequest} />
            )}
          </div>
        </div>
        <div className="okp4-faucet-content-info-main">
          <div>
            <Typography color="text" fontSize="x-small" fontWeight="bold">
              {t('faucet:faucet.info.limitation')}
            </Typography>
          </div>
          <div>
            <Typography as="div" color="text" fontSize="x-small" fontWeight="light">
              {t('faucet:faucet.info.message1', { env })}
            </Typography>
            <Typography as="span" color="text" fontSize="x-small" fontWeight="light">
              {t('faucet:faucet.info.message2')}
            </Typography>
            <Typography as="span" color="text" fontSize="x-small" fontWeight="bold">
              <a
                className="okp4-faucet-content-info-link"
                href="https://www.keplr.app/download"
                rel="noreferrer"
                target="_blank"
              >
                Keplr
              </a>
            </Typography>
            <Typography as="span" color="text" fontSize="x-small" fontWeight="light">
              {t('faucet:faucet.info.message3', { chainId })}
            </Typography>
          </div>
        </div>
      </div>
      <Toast
        autoDuration={4000}
        description={
          errorMessage
            ? t(`errorDomain:${errorMessage}`)
            : t('errorDomain:domain.error.unspecified-error')
        }
        isOpened={hasTransactionError}
        onOpenChange={acknowledgeFaucetError}
        severityLevel="error"
        title={t('faucet:faucet.common.error')}
      />
      <Toast
        autoDuration={4000}
        description={t('faucet:faucet.info.successMessage')}
        isOpened={!hasTransactionError && !!transactionSuccessId}
        onOpenChange={acknowledgeFaucetTask}
        severityLevel="success"
        title={t('faucet:faucet.common.success')}
      />
    </div>
  )
}
