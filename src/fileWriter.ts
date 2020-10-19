import { HARDENED_THRESHOLD } from './constants'
import {
  SignedTxCborHex,
  SignedTxOutput,
  TxWitnessKeys,
  WitnessOutput,
  WitnessOutputTypes,
  XPubKeyHex,
  _ByronWitness,
  _ShelleyWitness,
} from './transaction/types'
import {
  BIP32Path,
  HwSigningOutput,
  OutputData,
  VerificationKeyOutput,
} from './types'

const fs = require('fs')
const cbor = require('borc')

const write = (path: string, data: OutputData) => fs.writeFileSync(
  path,
  JSON.stringify(data, null, 4),
  'utf8',
)

const TxSignedOutput = (signedTxCborHex: SignedTxCborHex): SignedTxOutput => ({
  type: 'TxSignedShelley',
  description: '',
  cborHex: signedTxCborHex,
})

const TxWitnessOutput = (
  { key, data }: _ByronWitness | _ShelleyWitness,
): WitnessOutput => {
  const type = key === TxWitnessKeys.SHELLEY
    ? WitnessOutputTypes.SHELLEY
    : WitnessOutputTypes.BYRON
  return {
    type,
    description: '',
    cborHex: cbor.encode([key, data]).toString('hex'),
  }
}

const PathOutput = (path: BIP32Path): string => path
  .map((value) => (value >= HARDENED_THRESHOLD ? `${value - HARDENED_THRESHOLD}H` : `${value}`))
  .join('/')

const HwSigningKeyOutput = (xPubKey: XPubKeyHex, path: BIP32Path): HwSigningOutput => {
  const type = path[3] === 0 ? 'Payment' : 'Stake'
  return {
    type: `${type}HWSigningFileShelley_ed25519`, // TODO
    description: '',
    path: PathOutput(path),
    cborXPubKeyHex: cbor.encode(Buffer.from(xPubKey, 'hex')).toString('hex'),
  }
}

const HwVerificationKeyOutput = (xPubKey: XPubKeyHex, path: BIP32Path): VerificationKeyOutput => {
  const pubKey = Buffer.from(xPubKey, 'hex').slice(-64).slice(0, 32) // TODO
  const type = path[3] === 0 ? 'Payment' : 'Stake'
  return {
    type: `${type}VerificationKeyShelley_ed25519`, // TODO
    description: `${type} Verification Key`,
    cborHex: cbor.encode(pubKey).toString('hex'),
  }
}

export {
  write,
  TxSignedOutput,
  TxWitnessOutput,
  HwSigningKeyOutput,
  HwVerificationKeyOutput,
}
