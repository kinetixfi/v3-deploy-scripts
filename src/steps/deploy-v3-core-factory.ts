import KinetixV3Factory from '@kinetix/v3-core-smart-contracts/artifacts/contracts/KinetixV3Factory.sol/KinetixV3Factory.json'
import createDeployContractStep from './meta/createDeployContractStep'

export const DEPLOY_V3_CORE_FACTORY = createDeployContractStep({
  key: 'v3CoreFactoryAddress',
  artifact: KinetixV3Factory,
})
