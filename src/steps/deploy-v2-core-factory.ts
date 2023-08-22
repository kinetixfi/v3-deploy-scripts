import KinetixV2Factory from '@kinetix/v2-core/build/KinetixV2Factory.json'
import createDeployContractStep from './meta/createDeployContractStep'

export const DEPLOY_V2_CORE_FACTORY = createDeployContractStep({
  key: 'v2CoreFactoryAddress',
  artifact: { ...KinetixV2Factory, contractName: 'KinetixV2Factory', linkReferences: {} },
  computeArguments(state, config) {
    // if (state.v3CoreFactoryAddress === undefined) {
    //   throw new Error('Missing V3 Core Factory')
    // }
    // if (state.nonfungibleTokenPositionManagerAddress === undefined) {
    //   throw new Error('Missing NFT contract')
    // }
    console.log(state)
    console.log(config) // 0xd81c94cF5528eBc3d2C438c8e0a006822c1Ac93C
    return [config.admin]
  },
})
