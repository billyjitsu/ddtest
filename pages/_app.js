import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, lightTheme, darkTheme, midnightTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

/* adding gnosis network */
const GnosisChain = {
  id: 100,
  name: 'Gnosis Chain',
  network: 'Gnosis',
  nativeCurrency: {
    decimals: 18,
    name: 'xDai',
    symbol: 'xDai',
  },
  rpcUrls: {
    default: 'https://rpc.ankr.com/gnosis',
  },
  blockExplorers: {
    default: { name: 'Gnosis Scan', url: 'https://gnosisscan.io/' },
  },
  testnet: false,
}

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
   // jsonRpcProvider({ rpc: () => ({ http: 'https://rpc.ankr.com/eth' }) }),
   // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
  provider,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme ={midnightTheme({
        accentColor: '#623485',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'system',
      })}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
