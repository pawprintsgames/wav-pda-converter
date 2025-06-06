import { processADPCM } from "./adpcm";

import { pdaDataToBinary, parseWav } from "./util";

/** Converts a wav file buffer to a PDA buffer */
export function wavToPda(wav) {
  const data = parseWav(wav);

  if (data.pdaFormatEquivalent === "kFormatADPCMStereo") {
    throw new Error(
      "Stereo ADPCM-encoded WAV files are not yet supported, sorry. Please convert the WAV file to mono first."
    );
  }

  const header = pdaDataToBinary({
    fileType: "Playdate AUD",
    sampleRate: data.sampleRate,
    audioDataFormat: data.pdaFormatEquivalentCode,
  });

  const body =
    data.audioFormat === "ADPCM"
      ? processADPCM(data.data.samples, data.blockAlign, data.stereo)
      : data.data.samples;

  return Buffer.concat([header, body]);
}
