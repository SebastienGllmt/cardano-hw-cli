import { parseUnsignedTx } from './txParser'
import {
  TxWitnessByron,
  TxWitnessShelley,
  _UnsignedTxDecoded,
  UnsignedTxCborHex,
  SignedTxCborHex,
  _SignedTxDecoded,
  TxWitnessKeys,
  _TxAux,
  _ShelleyWitness,
  _ByronWitness,
  XPubKeyCborHex,
  _XPubKey,
  TxBodyKeys,
} from './types'
import { isUnsignedTxDecoded } from './guards'
import { Errors } from '../errors'
import { decodeCbor, encodeCbor } from '../util'
import { LedgerCatalystVotingRegistrationPayload } from '../crypto-providers/ledgerTypes'

const { blake2b } = require('cardano-crypto.js')

const TxByronWitness = (
  publicKey: Buffer, signature: Buffer, chaincode: Buffer, addressAttributes: object,
): TxWitnessByron => [publicKey, signature, chaincode, encodeCbor(addressAttributes)]

const TxShelleyWitness = (publicKey: Buffer, signature: Buffer): TxWitnessShelley => [publicKey, signature]

const parseUnsignedTxDecoded = (unsignedTxDecoded: _UnsignedTxDecoded) => {
  const parsedTx = parseUnsignedTx(unsignedTxDecoded)

  const getId = (): string => {
    const [txBody] = unsignedTxDecoded
    const encodedTxBody = encodeCbor(txBody)
    return blake2b(
      encodedTxBody,
      32,
    ).toString('hex')
  }

  return {
    getId,
    unsignedTxDecoded,
    ...parsedTx,
  }
}

const TxAux = (unsignedTxCborHex: UnsignedTxCborHex): _TxAux => {
  const unsignedTxDecoded = decodeCbor(unsignedTxCborHex)
  if (!isUnsignedTxDecoded(unsignedTxDecoded)) {
    throw Error(Errors.InvalidTransactionBody)
  } else {
    return parseUnsignedTxDecoded(unsignedTxDecoded)
  }
}

// TODO: Ledger type shouldnt be here, refactor
const VotingRegistrationDummyTxAux = (metaData: LedgerCatalystVotingRegistrationPayload, address: any, fee: BigInt): _TxAux => {
  const unsignedTxDecoded: _UnsignedTxDecoded = [new Map<TxBodyKeys, any>([
    [TxBodyKeys.INPUTS, []],
    // [TxBodyKeys.INPUTS, [Buffer.alloc(32, 0), 0]],
    [TxBodyKeys.OUTPUTS, []],
    [TxBodyKeys.FEE, fee],
    [TxBodyKeys.TTL, 0],
    [TxBodyKeys.META_DATA_HASH, blake2b(metaData, 32).toString('hex')],
  ]), metaData]

  return parseUnsignedTxDecoded(unsignedTxDecoded)
}

const TxSigned = (
  unsignedTxDecoded: _UnsignedTxDecoded,
  byronWitnesses: TxWitnessByron[],
  shelleyWitnesses: TxWitnessShelley[],
): SignedTxCborHex => {
  const [txBody, meta] = unsignedTxDecoded
  const witnesses = new Map()
  if (shelleyWitnesses.length > 0) {
    witnesses.set(TxWitnessKeys.SHELLEY, shelleyWitnesses)
  }
  if (byronWitnesses.length > 0) {
    witnesses.set(TxWitnessKeys.BYRON, byronWitnesses)
  }
  return encodeCbor([txBody, witnesses, meta]).toString('hex')
}

const Witness = (signedTxCborHex: SignedTxCborHex): Array<_ShelleyWitness | _ByronWitness> => {
  const [, witnesses]: _SignedTxDecoded = decodeCbor(signedTxCborHex)

  return Array.from(witnesses).map((witness) => {
    const [key, [data]] = witness
    return {
      key,
      data,
    } as _ShelleyWitness | _ByronWitness
  })
}

// TODO why is this in transaction.ts?
const XPubKey = (xPubKeyCborHex: XPubKeyCborHex): _XPubKey => {
  const xPubKeyDecoded = decodeCbor(xPubKeyCborHex)
  const pubKey = xPubKeyDecoded.slice(0, 32)
  const chainCode = xPubKeyDecoded.slice(32, 64)
  return { pubKey, chainCode }
}

export {
  TxByronWitness,
  TxShelleyWitness,
  TxAux,
  VotingRegistrationDummyTxAux,
  TxSigned,
  Witness,
  XPubKey,
}
