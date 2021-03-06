import { env, eth, utils, contracts } from 'decentraland-commons'

export async function connectEthereumWallet(options = {}, retries = 0) {
  try {
    const { MANAToken, LANDRegistry, Marketplace } = contracts
    const providerUrl = env.get('REACT_APP_PROVIDER_URL')

    let connected = await eth.connect({
      ...options,
      providerUrl,
      contracts: [MANAToken, LANDRegistry, Marketplace]
    })
    if (!connected) throw new Error('Could not connect to Ethereum')
  } catch (error) {
    if (retries >= 3) {
      console.warn(
        `Error trying to connect to Ethereum for the ${retries}th time`,
        error
      )
      throw error
    }
    await utils.sleep(500)
    return connectEthereumWallet(options, retries + 1)
  }
}

export function getManaToApprove() {
  return Math.pow(2, 180)
}

export function getMarketplaceAddress() {
  const marketplaceContract = eth.getContract('Marketplace')
  return marketplaceContract.address
}
