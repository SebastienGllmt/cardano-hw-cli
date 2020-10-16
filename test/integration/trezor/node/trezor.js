/* eslint-disable max-len */
const assert = require('assert')
const { TxAux } = require('../../../../src/transaction/transaction')
const { TrezorCryptoProvider } = require('../../../../src/crypto-providers/trezorCryptoProvider')
const { NETWORKS, HARDENED_THRESHOLD } = require('../../../../src/constants')

const signingFiles = {
  payment0: {
    type: 0,
    path: [
      1852 + HARDENED_THRESHOLD,
      1815 + HARDENED_THRESHOLD,
      0 + HARDENED_THRESHOLD,
      0,
      0,
    ],
    cborXPubKeyHex: '58403913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba17290a71987268d7d15e3d28264fda016fa611f981bb69d7b5ef051746ecdacc0dd90',
  },
  stake0: {
    type: 1,
    path: [
      1852 + HARDENED_THRESHOLD,
      1815 + HARDENED_THRESHOLD,
      0 + HARDENED_THRESHOLD,
      2,
      0,
    ],
    cborXPubKeyHex: '5840bface8f34e73d5cfdd138f9498a36def84318188c8bf3a8170b50f9d307eb234226b4b0687812953013d56e7f408f743ca6c05c184d743c2ba9007e4fc3ef00f',
  },
}

const transactions = {
  SimpleTransaction: {
    unsignedCborHex: '82a4008182582066001e24baf17637192d3a91c418cf4ed3c8053e333d0c35bd388deb2fa89c92000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a002b8a44021a0002b473031a00a2d750f6',
    hwSigningFiles: [signingFiles.payment0],
    signedTxCborHex: '83a4008182582066001e24baf17637192d3a91c418cf4ed3c8053e333d0c35bd388deb2fa89c92000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a002b8a44021a0002b473031a00a2d750a100818258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840acd168cc35e98a90297bde0256c95943b37e45b7f571ca871621d4586caa373ec263cf57302ecfc043cd33c251026c49bcf1ce635ac1f2c944be6c6a29f9be09f6',
    witnessCborHex: '82008258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840acd168cc35e98a90297bde0256c95943b37e45b7f571ca871621d4586caa373ec263cf57302ecfc043cd33c251026c49bcf1ce635ac1f2c944be6c6a29f9be09',
  },
  WithDelegation: {
    unsignedCborHex: '82a50081825820b06f6d9fbb888e82fd785a7e84760bbf89aea7a54e961840ecb8cb0bfe4aa7b5000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a001e44cc021a0002d7a4031a00a9aa9e048183028200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc5538581c04c60c78417132a195cbb74975346462410f72612952a7c4ade7e438f6',
    hwSigningFiles: [signingFiles.payment0, signingFiles.stake0],
    signedTxCborHex: '83a50081825820b06f6d9fbb888e82fd785a7e84760bbf89aea7a54e961840ecb8cb0bfe4aa7b5000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a001e44cc021a0002d7a4031a00a9aa9e048183028200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc5538581c04c60c78417132a195cbb74975346462410f72612952a7c4ade7e438a10082825820bface8f34e73d5cfdd138f9498a36def84318188c8bf3a8170b50f9d307eb234584079384143342248b41ad632a16057cd9edb00cddf9ae6dcd1a450d9ed6c3f777baa00473883af870fcd6a11dac38cd9c14235c07e649a453e92599eba35d93b098258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840845d371da37982c6d7dde3bc90ec88ed15fc60dffbf00729f71ff8f06b6583d23904da3ad86dec66cd2ab9c5b5dd2a09c72df169d5ca437d54e351bbda4c040df6',
    witnessCborHex: '',
  },
  WithWithdrawal: {
    unsignedCborHex: '82a50081825820594df045df4c3d4effe0f11215e55a9bd7227c50cdec4b5c5d5bb46caa0ae908000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a00191cc2021a0002eb41031a00d43cf105a1581de18636aa540280a200e32f45e98013c24218a1a4996504634150dc553819cfdcf6',
    hwSigningFiles: [signingFiles.payment0, signingFiles.stake0],
    signedTxCborHex: '83a50081825820594df045df4c3d4effe0f11215e55a9bd7227c50cdec4b5c5d5bb46caa0ae908000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a00191cc2021a0002eb41031a00d43cf105a1581de18636aa540280a200e32f45e98013c24218a1a4996504634150dc553819cfdca10082825820bface8f34e73d5cfdd138f9498a36def84318188c8bf3a8170b50f9d307eb2345840dae7c7812b94c034e1a3b9d5da74110bf4974cdbe55cf5c84caaf1452175fed71f2ee6abf82b62d0656dd452ac34fc0d41ad07f8c39b513ad61c0baecffe3e038258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840d2c96d5170ba8479e4ef0d947fd3e8bcf14712eea16a5737df3dc9924cd91eaca0675ba429551bf05b55858bedc9f7445bfc1667cc8a1c4959cd841f8a052e0df6',
    witnessCborHex: '',
  },
  WithStakingKeyDeregistration: {
    unsignedCborHex: '82a500818258202555e4d9888ed18c8cfcb7086a354def3d423cde977f8692ca6325b7ecaf3310000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a003499c5021a0003077d031a00d43cf1048182018200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc5538f6',
    hwSigningFiles: [signingFiles.payment0, signingFiles.stake0],
    signedTxCborHex: '83a500818258202555e4d9888ed18c8cfcb7086a354def3d423cde977f8692ca6325b7ecaf3310000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a003499c5021a0003077d031a00d43cf1048182018200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc5538a10082825820bface8f34e73d5cfdd138f9498a36def84318188c8bf3a8170b50f9d307eb2345840df1be280a7e9bf0aacc8825d3440f762beaedd469f674079da02621297cadcab4f7032c6b37ef7fb3468b4e3f182e7e7bc46628bbad7d2a754143f6c86eed0048258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840852e0779d0b26b00ea79956ecb8d6bb2e85960e9b6a864e4285ad97210cf98ca124e4cc83455a6f4bb3d81345aa82b50689eb1eec7604797aa547529bc763607f6',
    witnessCborHex: '',
  },
  WithStakeKeyRegistrationAndDelegation: {
    unsignedCborHex: '82a50081825820931b6e8994ae69eb770eb0d64417990ab1efeb53eb2f8a80ada28ba7f9334016000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a00131fef021a0002f556031a00aa0658048282008200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc553883028200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc5538581c04c60c78417132a195cbb74975346462410f72612952a7c4ade7e438f6',
    hwSigningFiles: [signingFiles.payment0, signingFiles.stake0],
    signedTxCborHex: '83a50081825820931b6e8994ae69eb770eb0d64417990ab1efeb53eb2f8a80ada28ba7f9334016000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a00131fef021a0002f556031a00aa0658048282008200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc553883028200581c8636aa540280a200e32f45e98013c24218a1a4996504634150dc5538581c04c60c78417132a195cbb74975346462410f72612952a7c4ade7e438a10082825820bface8f34e73d5cfdd138f9498a36def84318188c8bf3a8170b50f9d307eb2345840d55cee4e38e1bcd83874b432e29e8f30562fd33941ef0990f474b80ee6bf90ce7a1fb95653c81af2670125428145fd90b07ca634348e53de5a06cb6acd449f098258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840d5713de449ca2e9c0faddb59a16a94b94363caad3aef86fae35d60fc0fe1ee848cd9047649987703e68cd96e880e603f7b16cd86b5cd94c2891540a42b7df708f6',
    witnessCborHex: '',
  },
  WithMultipleInputsAndOutputs: {
    unsignedCborHex: '82a4008182582056fad20b5e1786b3e76017b256b56dbe4d677f27da4675f5666b3344add7f330000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a00211c70021a00029b75031a00c4fab1f6',
    hwSigningFiles: [signingFiles.payment0, signingFiles.stake0],
    signedTxCborHex: '83a4008182582056fad20b5e1786b3e76017b256b56dbe4d677f27da4675f5666b3344add7f330000181825839013fc4aa3daffa8cc5275cd2d095a461c05903bae76aa9a5f7999613c58636aa540280a200e32f45e98013c24218a1a4996504634150dc55381a00211c70021a00029b75031a00c4fab1a100818258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba17290584092b5173ff7fceefd69940a20e732cde909067faa54e55e7d542afaa946e41fc9aebb93a2310815bfec98f887b86a78708b22414e8b09edcb52e2105d33000005f6',
    witnessCborHex: '82008258203913a8b0e4009fee670ca24735efb7f86d8698bf47f3f144fe1a1a72bba172905840c93c6205360d09750fcc23e7e8d578411a308e2e9d25853b5d8313ec1ecf97291dd661739eb8b12bb1b90bf34d5035e58cf6602b750da6db07f8baad4cf7140e',
  },
}

async function testTxSigning(cryptoProvider, transaction) {
  const txAux = TxAux(transaction.unsignedCborHex)
  const signedTxCborHex = await cryptoProvider.signTx(
    txAux,
    transaction.hwSigningFiles,
    NETWORKS.MAINNET,
  )
  assert.deepStrictEqual(signedTxCborHex, transaction.signedTxCborHex)
}

describe('Trezor tx signing', () => {
  let cryptoProvider
  before(async () => {
    cryptoProvider = await TrezorCryptoProvider()
  })
  after(async () => {
    // cryptoProvider.TrezorConnect.dispose() // this doesnt work
  })
  Object.entries(transactions).forEach(([txType, tx]) => it(
    txType, async () => testTxSigning(cryptoProvider, tx),
  ).timeout(100000))
})