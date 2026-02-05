// API Configuration
// Replace these with your actual API keys or use environment variables

export const API_CONFIG = {
  // Hugging Face API for AI Analysis
  HUGGING_FACE_API_KEY: import.meta.env.VITE_HUGGING_FACE_API_KEY || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  HUGGING_FACE_MODEL: 'deepseek-ai/DeepSeek-V3.1',
  HUGGING_FACE_ENDPOINT: 'https://router.huggingface.co/v1/chat/completions',
  
  // ElevenLabs API for Text-to-Speech
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY || '',
  ELEVEN_LABS_VOICE_ID: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || '',
  ELEVEN_LABS_ENDPOINT: 'https://api.elevenlabs.io/v1/text-to-speech'
};

// Helper function to check if API keys are configured
export const isAPIConfigured = () => {
  return API_CONFIG.HUGGING_FACE_API_KEY && 
         API_CONFIG.HUGGING_FACE_API_KEY !== 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' &&
         API_CONFIG.HUGGING_FACE_API_KEY.startsWith('hf_');
};
