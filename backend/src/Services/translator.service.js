import * as deepl from 'deepl-node';
import { DEEPL_AUTH_KEY } from '../constant.js';

const translator = new deepl.Translator(DEEPL_AUTH_KEY);
const MAX_TEXTS_PER_REQUEST = 50;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

export async function translateTexts(texts, targetLang = 'ar') {
      // Filter out empty or invalid strings
      const originalLength = texts?.length || 0;
      texts = texts?.filter(t => typeof t === 'string' && t.trim() !== '') || [];
      if (!texts.length) {
            console.warn(`translateTexts: Skipped translation because all ${originalLength} items were empty or invalid.`);
            return [];
      }


      try {
            const batches = [];
            for (let i = 0; i < texts.length; i += MAX_TEXTS_PER_REQUEST) {
                  batches.push(texts.slice(i, i + MAX_TEXTS_PER_REQUEST));
            }


            const translatedBatches = [];

            for (const [index, batch] of batches.entries()) {
                  let retryCount = 0;
                  while (retryCount <= MAX_RETRIES) {
                        try {
                              const result = await translator.translateText(
                                    batch,
                                    null,
                                    targetLang,
                                    {
                                          formality: 'prefer_less',
                                          splitSentences: 'nonewlines',
                                          tagHandling: 'html'
                                    }
                              );
                              translatedBatches.push(result.map(r => r.text));
                              break;
                        } catch (error) {
                              if (error instanceof deepl.TooManyRequestsError && retryCount < MAX_RETRIES) {
                                    retryCount++;
                                    console.warn(`Retrying batch ${index} (attempt ${retryCount})...`);
                                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                              } else {
                                    throw error;
                              }
                        }
                  }
            }

            return translatedBatches.flat();
      } catch (error) {
            console.error('DeepL Translation Error:', error.message);
            throw error;
      }
}
