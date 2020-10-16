/* eslint-disable no-console */
import { parse } from './command-parser/commandParser'
import { CommandExecutor } from './commandExecutor'
import { getErrorTranslation } from './errors'
import NamedError from './namedError'
import { CommandType, ParsedArguments } from './types'

const executeCommand = async (parsedArgs: ParsedArguments) => {
  if (
    parsedArgs.command === CommandType.KEY_GEN
    || parsedArgs.command === CommandType.VERIFICATION_KEY
    || parsedArgs.command === CommandType.SIGN_TRANSACTION
    || parsedArgs.command === CommandType.WITNESS_TRANSACTION
  ) {
    const commandExecutor = await CommandExecutor()
    switch (parsedArgs.command) {
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
      default:
        throw NamedError('UndefinedCommandError')
    }
  }
}

const printError = (e: Error) => {
  console.log(getErrorTranslation(e))
  console.log(e.stack)
}

try {
  const parsedArgs = parse(process.argv)

  executeCommand(parsedArgs).catch((e) => {
    printError(e)
    // get help for command
  }).finally(() => {
    process.exit()
  })
} catch (e) {
  printError(e)
}
