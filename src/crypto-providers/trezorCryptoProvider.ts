import {
  SignedTxCborHex,
  _TxAux,
  _Input,
  _Output,
  _ByronWitness,
  _ShelleyWitness,
  TxCertificateKeys,
  _Certificate,
  _Withdrawal,
} from '../transaction/types'
import { CryptoProvider, _AddressParameters } from './types'
import {
  TrezorInput,
  TrezorOutput,
  TrezorWithdrawal,
  TrezorCertificate,
} from './trezorTypes'
import {
  Witness,
} from '../transaction/transaction'
import { BIP32Path, HwSigningData, Network } from '../types'
import {
  isDelegationCertificate,
  isStakepoolRegistrationCertificate,
  isStakingKeyDeregistrationCertificate,
  isStakingKeyRegistrationCertificate,
} from './guards'
import {
  encodeAddress,
  filterSigningFiles,
  findSigningPath,
  getChangeAddress,
  getSigningPath,
} from './util'

const TrezorConnect = require('trezor-connect').default

const TrezorCryptoProvider: () => Promise<CryptoProvider> = async () => {
  TrezorConnect.manifest({
    email: 'todo',
    appUrl: 'todo',
  })
  await TrezorConnect.getFeatures()

  async function getXPubKey(path: BIP32Path): Promise<string> {
    const { payload } = await TrezorConnect.cardanoGetPublicKey({
      path,
      showOnTrezor: false,
    })
    return payload.publicKey
  }

  function prepareInput(input: _Input, path?: BIP32Path): TrezorInput {
    return {
      path,
      prev_hash: input.txHash.toString('hex'),
      prev_index: input.outputIndex,
    }
  }

  function prepareChangeOutput(
    coins: number,
    changeAddress: _AddressParameters,
  ) {
    return {
      amount: `${coins}`,
      addressParameters: {
        addressType: changeAddress.addressType,
        path: changeAddress.paymentPath,
        stakingPath: changeAddress.stakePath,
      },
    }
  }

  function prepareOutput(
    output: _Output,
    network: Network,
    changeOutputFiles: HwSigningData[],
  ): TrezorOutput {
    const changeAddress = getChangeAddress(changeOutputFiles, output.address, network)
    const address = encodeAddress(output.address)
    if (changeAddress && !changeAddress.address.compare(output.address)) {
      return prepareChangeOutput(output.coins, changeAddress)
    }
    return {
      address,
      amount: `${output.coins}`,
    }
  }

  function prepareStakingKeyRegistrationCert(
    cert: _Certificate, stakeSigningFiles: HwSigningData[],
  ): TrezorCertificate {
    if (
      !isStakingKeyRegistrationCertificate(cert) && !isStakingKeyDeregistrationCertificate(cert)
    ) throw Error()
    const path = findSigningPath(cert.pubKeyHash, stakeSigningFiles)
    return {
      type: cert.type,
      path,
    }
  }

  function prepareDelegationCert(
    cert: _Certificate, stakeSigningFiles: HwSigningData[],
  ): TrezorCertificate {
    if (!isDelegationCertificate(cert)) throw Error()
    const path = findSigningPath(cert.pubKeyHash, stakeSigningFiles)
    return {
      type: cert.type,
      path,
      pool: cert.poolHash.toString('hex'),
    }
  }

  function prepareStakePoolRegistrationCert(
    cert: _Certificate, stakeSigningFiles: HwSigningData[],
  ): TrezorCertificate {
    if (!isStakepoolRegistrationCertificate(cert)) throw Error()
    const path = findSigningPath(cert.ownerPubKeys[0], stakeSigningFiles)
    // TODO: we need to iterate through the owner pubkeys
    return { // TODO: proper pool reg cert
      type: cert.type,
      path,
    }
  }

  function prepareCertificate(
    certificate: _Certificate, stakeSigningFiles: HwSigningData[],
  ): TrezorCertificate {
    switch (certificate.type) {
      case TxCertificateKeys.STAKING_KEY_REGISTRATION:
        return prepareStakingKeyRegistrationCert(certificate, stakeSigningFiles)
      case TxCertificateKeys.STAKING_KEY_DEREGISTRATION:
        return prepareStakingKeyRegistrationCert(certificate, stakeSigningFiles)
      case TxCertificateKeys.DELEGATION:
        return prepareDelegationCert(certificate, stakeSigningFiles)
      case TxCertificateKeys.STAKEPOOL_REGISTRATION:
        return prepareStakePoolRegistrationCert(certificate, stakeSigningFiles)
      default:
        throw Error('UnknownCertificateTypeError')
    }
  }

  function prepareWithdrawal(
    withdrawal: _Withdrawal, stakeSigningFiles: HwSigningData[],
  ): TrezorWithdrawal {
    const pubKeyHash = withdrawal.address.slice(1) // TODO: helper
    const path = findSigningPath(pubKeyHash, stakeSigningFiles)
    return {
      path,
      amount: `${withdrawal.coins}`,
    }
  }

  async function signTx(
    txAux: _TxAux,
    signingFiles: HwSigningData[],
    network: Network,
    changeOutputFiles: HwSigningData[],
  ): Promise<SignedTxCborHex> {
    const {
      paymentSigningFiles,
      stakeSigningFiles,
    } = filterSigningFiles(signingFiles)
    const inputs = txAux.inputs.map(
      (input, i) => prepareInput(input, getSigningPath(paymentSigningFiles, i)),
    )
    const outputs = txAux.outputs.map(
      (output) => prepareOutput(output, network, changeOutputFiles),
    )
    const certificates = txAux.certificates.map(
      (certificate) => prepareCertificate(certificate, stakeSigningFiles),
    )
    const { fee } = txAux
    const { ttl } = txAux
    const withdrawals = txAux.withdrawals.map(
      (withdrawal) => prepareWithdrawal(withdrawal, stakeSigningFiles),
    )

    const response = await TrezorConnect.cardanoSignTransaction({
      inputs,
      outputs,
      protocolMagic: network.protocolMagic,
      fee,
      ttl,
      networkId: network.networkId,
      certificates,
      withdrawals,
    })

    if (response.error || !response.success) {
      throw Error('TrezorSignTxError')
    }

    return response.payload.serializedTx as SignedTxCborHex
  }

  async function witnessTx(
    txAux: _TxAux,
    signingFile: HwSigningData,
    network: Network,
    changeOutputFiles: HwSigningData[],
  ): Promise<_ByronWitness | _ShelleyWitness> {
    const signedTx = await signTx(txAux, [signingFile], network, changeOutputFiles)
    return Witness(signedTx)
  }

  return {
    witnessTx,
    signTx,
    getXPubKey,
  }
}

export {
  TrezorCryptoProvider,
}
