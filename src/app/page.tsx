import { getSpaceMode } from "@/lib/spaceMode";
import HomeClassic from "./HomeClassic";
import AISeoContent from "@/components/AISeoContent";
import SpaceExperienceClient from "@/components/three/space/SpaceExperienceClient";

export default async function Home() {
  const space = await getSpaceMode();
  if (space) {
    return (
      <>
        <AISeoContent />
        <SpaceExperienceClient />
      </>
    );
  }
  return <HomeClassic />;
}
