import KinetixV3Factory from '@kinetix/v3-core/artifacts/contracts/KinetixV3Factory.sol/KinetixV3Factory.json'
import { Contract } from '@ethersproject/contracts'
import { MigrationStep } from '../migrations'

const ONE_BP_FEE = 100
const ONE_BP_TICK_SPACING = 1

export const ADD_1BP_FEE_TIER: MigrationStep = async (state, { signer, gasPrice }) => {
  if (state.v3CoreFactoryAddress === undefined) {
    throw new Error('Missing KinetixV3Factory')
  }

  const v3CoreFactory = new Contract(state.v3CoreFactoryAddress, KinetixV3Factory.abi, signer)

  const owner = await v3CoreFactory.owner()
  if (owner !== (await signer.getAddress())) {
    throw new Error('KinetixV3Factory.owner is not signer')
  }
  const tx = await v3CoreFactory.enableFeeAmount(ONE_BP_FEE, ONE_BP_TICK_SPACING, { gasPrice })

  return [
    {
      message: `KinetixV3Factory added a new fee tier ${ONE_BP_FEE / 100} bps with tick spacing ${ONE_BP_TICK_SPACING}`,
      hash: tx.hash,
    },
  ]
}
