const localVehicleImageFilenames = [
  'aaron-huber-8qYE6LGHW-c-unsplash.jpg',
  'david-moffatt-wg5OReRpgCo-unsplash.jpg',
  'josh-berquist-0kxOW0I-HLM-unsplash.jpg',
  'joshua-koblin-eqW1MPinEV4-unsplash.jpg',
  'kenny-eliason-FcyipqujfGg-unsplash.jpg',
  'marek-pospisil-oUBjd22gF6w-unsplash.jpg',
  'mitch-kemp-2w_Nxti8iKE-unsplash.jpg',
  'olav-tvedt-6lSBynPRaAQ-unsplash.jpg',
  'pexels-adrian-dorobantu-989175-2127733.jpg',
  'pexels-alshreef-32757555.jpg',
  'pexels-arnie-watkins-1337313-3156482.jpg',
  'pexels-avinashpatel-544542.jpg',
  'pexels-bradakan-30806975.jpg',
  'pexels-brett-sayles-1638459.jpg',
  'pexels-cesarperez209-733745.jpg',
  'pexels-charles-kettor-268979-831475.jpg',
  'pexels-danielspase-949796.jpg',
  'pexels-dom-j-7304-303316.jpg',
  'pexels-jacobmorch-457418.jpg',
  'pexels-junnoet-235222.jpg',
  'pexels-kampratt-5086489.jpg',
  'pexels-louis-gys-218031041-12040980.jpg',
  'pexels-lynxexotics-3802508.jpg',
  'pexels-mali-97458.jpg',
  'pexels-marco-antonio-diaz-213207-682484.jpg',
  'pexels-mikebirdy-1054211.jpg',
  'pexels-mikebirdy-112460.jpg',
  'pexels-mikebirdy-170811.jpg',
  'pexels-mikebirdy-244206.jpg',
  'pexels-mikebirdy-446389.jpg',
  'pexels-mikebirdy-452099.jpg',
  'pexels-mikebirdy-977003.jpg',
  'pexels-pashal-337909.jpg',
  'pexels-peely-712618.jpg',
  'pexels-pixabay-164654.jpg',
  'pexels-pixabay-210019.jpg',
  'pexels-pixabay-39855.jpg',
  'pexels-quintingellar-313779.jpg',
  'pexels-riel-png-250154.jpg',
  'pexels-sevenstormphotography-575386.jpg',
  'pexels-stephanlouis-5381501.jpg',
  'pexels-vladalex94-1402787.jpg',
  'pexels-yuraforrat-8642186.jpg',
  'pexels-zsolt-joo-483255-2882234.jpg',
  'stefan-rodriguez-2AovfzYV3rc-unsplash.jpg',
  'steven-binotto-o6yH_yAc2Ws-unsplash.jpg'
] as const;

const localVehicleImagePaths: string[] = localVehicleImageFilenames.map((filename) => `/images/${filename}`);

export function getLocalVehicleImage(vehicleId: string, fallbackImage: string): string {
  if (!localVehicleImagePaths.length) {
    return fallbackImage;
  }

  let hash = 0;
  for (let index = 0; index < vehicleId.length; index += 1) {
    hash = (hash * 31 + vehicleId.charCodeAt(index)) >>> 0;
  }

  const imageIndex = hash % localVehicleImagePaths.length;
  return localVehicleImagePaths[imageIndex] ?? fallbackImage;
}
