import HomeClient from "@/components/HomeClient";
import { THEMES } from "@/config/theme";
import { Metadata } from "next";

// Force static build for all networks
export function generateStaticParams() {
  return Object.keys(THEMES).map((network) => ({
    network: network,
  }));
}

type Props = {
  params: { network: string };
};

const NETWORK_FILE_MAPPING: Record<string, string> = {
  arbitrum: "arb",
  arb: "arb",
  binance: "bsc",
  bsc: "bsc",
  ethereum: "eth",
  eth: "eth",
  hyperliquid: "hyper",
  hyper: "hyper",
  base: "base",
  celo: "celo",
  monad: "monad",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const network = params.network;
  const theme = THEMES[network] || THEMES.base;
  const chainName = theme.name;

  const mappedName = NETWORK_FILE_MAPPING[network.toLowerCase()] || network;

  // Dynamic Image URL (Absolute)
  // Fix: Use mapped name and suffix format: name-cover.png
  const imageUrl = `https://farmcaster-six.vercel.app/images/${mappedName}-cover.png`;

  const miniappJSON = {
    version: "1",
    imageUrl: imageUrl, // Uses network-specific image
    button: {
      title: "Play FarmCaster 🚜",
      action: {
        type: "launch_miniapp",
        url: "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster",
        splashImageUrl: "https://farmcaster-six.vercel.app/images/icon.png",
        splashBackgroundColor: "#0f172a"
      }
    }
  };

  const frameMetadata = {
    version: "next",
    imageUrl: imageUrl,
    button: {
      title: "Open FarmCaster",
      action: {
        type: "launch_frame",
        name: "FarmCaster",
        url: "https://farmcaster-six.vercel.app/",
        splashImageUrl: "https://farmcaster-six.vercel.app/images/splash.png",
        splashBackgroundColor: "#0f172a"
      }
    }
  };

  const stringifiedMeta = JSON.stringify(miniappJSON);
  const title = `FarmCaster on ${chainName}`;
  const description = `Plant seeds, earn XP, and climb the leaderboard on ${chainName}. The most vibrant onchain farming game.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
    other: {
      "fc:miniapp": stringifiedMeta,
      "fc:frame": JSON.stringify(frameMetadata),
    },
  };
}

export default function SharePage() {
  return <HomeClient />;
}
