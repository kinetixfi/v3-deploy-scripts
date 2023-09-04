import TokenValidator from '@kinetix/swap-router-contracts/artifacts/contracts/lens/TokenValidator.sol/TokenValidator.json'
import createDeployContractStep from './meta/createDeployContractStep'

export const DEPLOY_TOKEN_VALIDATOR = createDeployContractStep({
  key: 'tokenValidator',
  artifact: TokenValidator,
  computeArguments(state, config) {
    if (state.v2CoreFactoryAddress === undefined) {
      throw new Error('Missing V3 Core Factory')
    }
    if (state.nonfungibleTokenPositionManagerAddress === undefined) {
      throw new Error('Missing NFT manager')
    }

    return [
      config.v2CoreFactoryAddress,
      state.nonfungibleTokenPositionManagerAddress,
    ]
  },
})
