import { getSpaceMode } from "@/lib/spaceMode";
import HomeClassic from "./HomeClassic";
import SpaceExperienceClient from "@/components/three/space/SpaceExperienceClient";

export default async function Home() {
  const space = await getSpaceMode();
  if (space) {
    return (
      <>
        <SpaceExperienceClient />
      </>
    );
  }
  return <HomeClassic />;
}
