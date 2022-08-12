export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Represent a cosmos address as [Betch32](https://en.bitcoin.it/wiki/Bech32) format prefixed by the blockchain prefix.
   * e.i. `cosmos1jse8senm9hcvydhl8v9x47kfe5z82zmwtw8jvj`
   */
  Address: string;
  /** Represent a signed 64-bit integer */
  Long: BigUint64Array;
  /** An unsigned 64-bit integer */
  UInt64: BigUint64Array;
  /** Represent a void return type, representing no value */
  Void: string;
};

/** Represent the actual server configuration */
export type Configuration = {
  readonly __typename?: 'Configuration';
  /** Amount value of token to send */
  readonly amountSend: Scalars['Long'];
  /** The network chain ID */
  readonly chainId: Scalars['String'];
  /** Token denom */
  readonly denom: Scalars['String'];
  /** Fee amount allowed */
  readonly feeAmount: Scalars['Long'];
  /** Gas limit allowed on transaction */
  readonly gasLimit: Scalars['UInt64'];
  /** Memo used when send transaction */
  readonly memo: Scalars['String'];
  /** Address prefix */
  readonly prefix: Scalars['String'];
};

/** List of all mutations */
export type Mutation = {
  readonly __typename?: 'Mutation';
  /**
   * Send the configured amount of token to the given address, returning nothing as the transaction is made
   * asynchronously. A successful invocation means that the send operation is queued and will be processed, but it'll
   * does not necessary lead to a successful transaction.
   *
   * For clients needing information on the underlying transaction state, consider using the `send` subscription.
   */
  readonly send?: Maybe<Scalars['Void']>;
};


/** List of all mutations */
export type MutationSendArgs = {
  input: SendInput;
};

/** List of all queries */
export type Query = {
  readonly __typename?: 'Query';
  /** This query allow to get the actual server configuration. */
  readonly configuration: Configuration;
};

/** All inputs needed to send token to a given address */
export type SendInput = {
  /** Captcha token */
  readonly captchaToken?: InputMaybe<Scalars['String']>;
  /** Address where to send token(s) */
  readonly toAddress: Scalars['Address'];
};

/** List of all subscriptions */
export type Subscription = {
  readonly __typename?: 'Subscription';
  /**
   * Send the configured amount of token to the given address.
   *
   * By opening the subscription the send message is added to a queue, once the transaction is successfully submitted
   * with all the queued messages it'll return the corresponding before closing the stream. A successful submission does
   * not mean it has been successfully written in a block, it is the client's responsibility to make additional checks
   * through the transaction's code and hash.
   */
  readonly send: TxResponse;
};


/** List of all subscriptions */
export type SubscriptionSendArgs = {
  input: SendInput;
};

/** Represent a transaction response */
export type TxResponse = {
  readonly __typename?: 'TxResponse';
  /**
   * Return the result code of transaction.
   * See code correspondence error : https://github.com/cosmos/cosmos-sdk/blob/main/types/errors/errors.go
   */
  readonly code: Scalars['Int'];
  /** Transaction gas used */
  readonly gasUsed: Scalars['Long'];
  /** Transaction gas wanted */
  readonly gasWanted: Scalars['Long'];
  /** Corresponding to the transaction hash. */
  readonly hash: Scalars['String'];
  /** Description of error if available. */
  readonly rawLog?: Maybe<Scalars['String']>;
};

export type MSendTokensSubscriptionVariables = Exact<{
  input: SendInput;
}>;


export type MSendTokensSubscription = { readonly __typename?: 'Subscription', readonly send: { readonly __typename?: 'TxResponse', readonly hash: string } };
