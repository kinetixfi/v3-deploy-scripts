import KinetixV3Factory from '@kinetix/v3-core/artifacts/contracts/KinetixV3Factory.sol/KinetixV3Factory.json'
import { Contract } from '@ethersproject/contracts'
import { MigrationStep } from '../migrations'

export const TRANSFER_V3_CORE_FACTORY_OWNER: MigrationStep = async (state, { signer, gasPrice, ownerAddress }) => {
  if (state.v3CoreFactoryAddress === undefined) {
    throw new Error('Missing KinetixV3Factory')
  }

  const v3CoreFactory = new Contract(state.v3CoreFactoryAddress, KinetixV3Factory.abi, signer)

  const owner = await v3CoreFactory.owner()
  if (owner === ownerAddress)
    return [
      {
        message: `KinetixV3Factory owned by ${ownerAddress} already`,
      },
    ]

  if (owner !== (await signer.getAddress())) {
    throw new Error('KinetixV3Factory.owner is not signer')
  }

  const tx = await v3CoreFactory.setOwner(ownerAddress, { gasPrice })

  return [
    {
      message: `KinetixV3Factory ownership set to ${ownerAddress}`,
      hash: tx.hash,
    },
  ]
}
