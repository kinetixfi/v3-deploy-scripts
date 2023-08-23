import Unsupported from '@kinetix/universal-router/artifacts/contracts/deploy/UnsupportedProtocol.sol/UnsupportedProtocol.json'
import createDeployContractStep from './meta/createDeployContractStep'

export const DEPLOY_UNSUPPORTED = createDeployContractStep({
  key: 'unsupported',
  artifact: Unsupported,
})
