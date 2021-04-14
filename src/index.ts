/* eslint-disable no-console */
import { CommandType, parse } from './command-parser/commandParser'
import { parseAppVersion } from './command-parser/parsers'
import { CommandExecutor } from './commandExecutor'
import { Errors } from './errors'

// const cbor = require('borc')
// const { bech32 } = require('cardano-crypto.js')
// const {prefix, data} = bech32.decode('addr_test1qreakg39wqlye7lzyfmh900s2luc99zf7x9vs839pn4srjs2s3ps2plp2rc2qcgfmsa8kx2kk7s9s6hfq799tmcwpvps36jz6w')
// // console.log(prefix)
// // console.log(data.toString('hex'))
// // console.log(cbor.decode('584090ca5e64214a03ec975e5097c25b2a49d4ca4988243bc0142b5ada743d80b9d5be68538e05e31dc8fff62a62868c43f229cacbee5c40cbe6493929ad1f0e3cd9'))
// // cbor.encode(data)

// process.exit(0)

const executeCommand = async (): Promise<void> => {
  const { parser, parsedArgs } = parse(process.argv)
  if (!Object.values(CommandType).includes(parsedArgs.command)) {
    parser.print_help()
    return
  }

  if (parsedArgs.command === CommandType.APP_VERSION) {
    const { version, commit } = parseAppVersion()
    console.log(`Cardano HW CLI Tool version ${version}`)
    if (commit) console.log(`Commit hash: ${commit}`)
    return
  }

  const commandExecutor = await CommandExecutor()
  switch (parsedArgs.command) {
    case (CommandType.DEVICE_VERSION):
      await commandExecutor.printDeviceVersion()
      break
    case (CommandType.SHOW_ADDRESS):
      await commandExecutor.showAddress(parsedArgs)
      break
    case (CommandType.ADDRESS_KEY_GEN):
      await commandExecutor.createSigningKeyFile(parsedArgs)
      break
    case (CommandType.VERIFICATION_KEY):
      await commandExecutor.createVerificationKeyFile(parsedArgs)
      break
    case (CommandType.SIGN_TRANSACTION):
      await commandExecutor.createSignedTx(parsedArgs)
      break
    case (CommandType.WITNESS_TRANSACTION):
      await commandExecutor.createTxWitness(parsedArgs)
      break
    case (CommandType.NODE_KEY_GEN):
      await commandExecutor.createNodeSigningKeyFiles(parsedArgs)
      break
    case (CommandType.SIGN_OPERATIONAL_CERTIFICATE):
      await commandExecutor.createSignedOperationalCertificate(parsedArgs)
      break
    case (CommandType.CATALYST_VOTING_KEY_REGISTRATION_METADATA):
      await commandExecutor.createCatalystVotingKeyRegistrationMetadata(parsedArgs)
      break
    default:
      throw Error(Errors.UndefinedCommandError)
  }
}

executeCommand()
  .then(() => process.exit(0))
  .catch((e: Error) => {
    console.error('Error:', e.message)
    process.exit(1)
  })
