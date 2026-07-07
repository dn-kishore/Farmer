let currentAudio = null;
let currentId = null;

const ttsService = {
  speak: async (text, lang, id, onend, onerror) => {
    try {
      // If clicking same ID, stop playing
      if (currentId === id) {
        ttsService.cancel();
        if (onend) onend();
        return;
      }

      // Stop anything playing
      ttsService.cancel();

      currentId = id;
      console.log('Fetching TTS from Sarvam AI for language:', lang);

      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY || ''
        },
        body: JSON.stringify({
          text: text,
          target_language_code: lang === 'te' ? 'te-IN' : 'en-IN',
          speaker: lang === 'te' ? 'roopa' : 'shubh',
          model: 'bulbul:v3'
        })
      });

      if (!response.ok) {
        throw new Error(`Sarvam TTS API failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.audios || !data.audios[0]) {
        throw new Error('No audio returned from Sarvam TTS API');
      }

      const audioUrl = `data:audio/wav;base64,${data.audios[0]}`;
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onended = () => {
        currentId = null;
        currentAudio = null;
        if (onend) onend();
      };

      audio.onerror = (e) => {
        console.error('Audio playback error', e);
        currentId = null;
        currentAudio = null;
        if (onerror) onerror(e);
      };

      await audio.play();

    } catch (err) {
      console.error('Failed to speak text using Sarvam AI:', err);
      currentId = null;
      currentAudio = null;
      if (onerror) onerror(err);
    }
  },

  getCurrentId: () => {
    return currentId;
  },

  cancel: () => {
    if (currentAudio) {
      try {
        currentAudio.pause();
      } catch (e) {
        console.warn('Failed to pause audio', e);
      }
      currentAudio = null;
    }
    currentId = null;
  }
};

export default ttsService;
