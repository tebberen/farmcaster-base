import { Metadata, ResolvingMetadata } from 'next';
import HomeClient from '../components/HomeClient';
import { getNetworkImage } from '../utils/networkImage';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: "FarmCaster",
    description: "Plant seeds & harvest rewards onchain! 🚜",
    metadataBase: new URL("https://farmcaster-six.vercel.app"),
    openGraph: {
      images: ["https://farmcaster-six.vercel.app/images/icon.png"],
      title: "FarmCaster",
      description: "Plant seeds & harvest rewards onchain! 🚜",
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": "https://farmcaster-six.vercel.app/images/icon.png",
      "fc:frame:button:1": "Play FarmCaster 🚜",
      "fc:frame:button:1:action": "link",
      // THIS IS THE REDIRECT: Clicking the Vercel card opens the Warpcast Mini App
      "fc:frame:button:1:target": "https://warpcast.com/~/miniapps/nso1qw0jxEyg/farmcaster",
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
