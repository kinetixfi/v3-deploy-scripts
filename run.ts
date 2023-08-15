import { program } from 'commander'
import { Wallet } from '@ethersproject/wallet'
import { JsonRpcProvider, TransactionReceipt } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { getAddress } from '@ethersproject/address'
import fs from 'fs'
import deploy from './src/deploy'
import { MigrationState } from './src/migrations'
import { asciiStringToBytes32 } from './src/util/asciiStringToBytes32'

require('dotenv').config()

const ACCOUNT = process.env.ACCOUNT
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!ACCOUNT) throw new Error('ACCOUNT required. Add it to .env file')
if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY required. Add it to .env file')

const config = {
  rpc: 'https://evm.kava.io',
  gasPrice: undefined,
  confirmations: 1,
  nativeCurrencyLabelBytes: asciiStringToBytes32('KAVA'),
  weth9Address: getAddress('0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b'), // WKAVA
  v2CoreFactoryAddress: AddressZero,
  ownerAddress: ACCOUNT, // Deployer
  privateKey: PRIVATE_KEY, // Deployer's private key
  state: 'state.json',
}

let state: MigrationState
if (fs.existsSync(config.state)) {
  try {
    state = JSON.parse(fs.readFileSync(config.state, { encoding: 'utf8' }))
  } catch (error) {
    console.error('Failed to load and parse migration state file', (error as Error).message)
    process.exit(1)
  }
} else {
  state = {}
}

let finalState: MigrationState
const onStateChange = async (newState: MigrationState): Promise<void> => {
  fs.writeFileSync(config.state, JSON.stringify(newState))
  finalState = newState
}

async function run() {
  const wallet = new Wallet(config.privateKey, new JsonRpcProvider({ url: config.rpc }))

  let step = 1
  const results = []
  const generator = deploy({
    signer: wallet,
    gasPrice: config.gasPrice,
    nativeCurrencyLabelBytes: config.nativeCurrencyLabelBytes,
    v2CoreFactoryAddress: config.v2CoreFactoryAddress,
    ownerAddress: config.ownerAddress,
    weth9Address: config.weth9Address,
    initialState: state,
    onStateChange,
  })

  for await (const result of generator) {
    console.log(`Step ${step++} complete`, result)
    results.push(result)

    // wait 15 minutes for any transactions sent in the step
    await Promise.all(
      result.map(
        (stepResult): Promise<TransactionReceipt | true> => {
          if (stepResult.hash) {
            return wallet.provider.waitForTransaction(
              stepResult.hash,
              config.confirmations,
              /* 15 minutes */ 1000 * 60 * 15
            )
          } else {
            return Promise.resolve(true)
          }
        }
      )
    )
  }

  return results
}

run()
  .then((results) => {
    console.log('Deployment succeeded')
    console.log(JSON.stringify(results))
    console.log('Final state')
    console.log(JSON.stringify(finalState))
    process.exit(0)
  })
  .catch((error) => {
    console.error('Deployment failed', error)
    console.log('Final state')
    console.log(JSON.stringify(finalState))
    process.exit(1)
  })
