import createDeployContractStep from './meta/createDeployContractStep'

import permit2 from '../artifacts/Permit2.json'

export const DEPLOY_PERMIT2 = createDeployContractStep({
  key: 'permit2Address',
  artifact: { ...permit2, bytecode: permit2.bytecode.object, contractName: 'Permit2', linkReferences: {} },
})
