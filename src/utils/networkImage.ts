export function getNetworkImage(networkName: string | null | undefined): string {
  const normalizedName = networkName?.toLowerCase();

  switch (normalizedName) {
    case 'arbitrum':
      return 'arb-cover.png';
    case 'base':
      return 'base-cover.png';
    case 'bsc':
      return 'bsc-cover.png';
    case 'celo':
      return 'celo-cover.png';
    case 'ethereum':
      return 'eth-cover.png';
    case 'hyper':
    case 'hyperevm':
      return 'hyper-cover.png';
    case 'monad':
      return 'monad-cover.png';
    default:
      // Fallback image if no network is specified or matched
      return 'cover.png';
  }
}
