import { defineChain } from 'viem';

export const sagaChain = defineChain({
  id: 2021,
  name: 'Ronin Saigon Testnet',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://saigon-testnet.roninchain.com/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ronin Explorer',
      url: 'https://saigon-app.roninchain.com',
    },
  },
  testnet: true,
});

export const SAGA_CHAIN_CONFIG = {
  chainId: 'ronin_saigon_2021',
  rpcUrl: 'https://saigon-testnet.roninchain.com/rpc',
  wsUrl: '',
  blockExplorer: 'https://saigon-app.roninchain.com/',
  gasReturnAccount: '0x31Ae3219702319430a6940AE201c5e8b4D5fe7F1',
  networkId: 2021,
};

export const GAME_LICENSING_CONFIG = {
  contractAddress: '0xe29Eb65EE3Dda606E9f2e0aD6D2D4f73AEF83846',
  arLensesGameId: 1,
  arLensesPrice: 0.15, // RON tokens
};

export const PRIVY_CHAINS = [
  {
    chainId: SAGA_CHAIN_CONFIG.networkId,
    name: 'Ronin Saigon Testnet',
    rpcUrl: SAGA_CHAIN_CONFIG.rpcUrl,
    nativeCurrency: {
      name: 'RON',
      symbol: 'RON',
      decimals: 18,
    },
    blockExplorerUrl: SAGA_CHAIN_CONFIG.blockExplorer,
  },
];
