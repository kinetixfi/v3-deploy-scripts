import KinetixV2Router02 from '@kinetix/v2-periphery/build/KinetixV2Router02.json'
import createDeployContractStep from './meta/createDeployContractStep'

export const DEPLOY_V2_ROUTER_02 = createDeployContractStep({
  key: 'v2Router02Address',
  artifact: { ...KinetixV2Router02, contractName: 'KinetixV2Router02', linkReferences: {} },
  computeArguments(state, config) {
    if (state.v2CoreFactoryAddress === undefined) {
      throw new Error('Missing V2 Core Factory')
    }
    return [state.v2CoreFactoryAddress, config.weth9Address]
  },
})
