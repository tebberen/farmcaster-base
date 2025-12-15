import { http, createConfig } from 'wagmi';
import { base, celo, bsc, arbitrum, mainnet, optimism } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { defineChain } from "viem";

export const monadMainnet = defineChain({
  id: 143,
  name: 'Monad Mainnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadVision', url: 'https://monadvision.com' },
  },
  testnet: false,
});

export const hyperEvmMainnet = defineChain({
  id: 999,
  name: 'HyperEVM Mainnet',
  nativeCurrency: { name: 'Hyper', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'HyperEVMScan', url: 'https://hyperevmscan.io' },
  },
  testnet: false,
});

export const config = createConfig({
  chains: [base, celo, bsc, arbitrum, mainnet, optimism, monadMainnet, hyperEvmMainnet],
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [monadMainnet.id]: http(),
    [hyperEvmMainnet.id]: http(),
  },
  connectors: [
    injected(),         // PRIORITY #1: Browser Extension (Metamask)
    coinbaseWallet({ appName: 'FarmCaster' }),
  ],
  ssr: true,
});
