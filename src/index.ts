/* eslint-disable no-console */
import { CommandType, parse } from './command-parser/commandParser'
import { parseAppVersion } from './command-parser/parsers'
import { CommandExecutor } from './commandExecutor'
import { Errors } from './errors'

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
    case (CommandType.KEY_GEN):
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
    case (CommandType.SIGN_OPERATIONAL_CERTIFICATE):
      await commandExecutor.createSignedOperationalCertificate(parsedArgs)
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
