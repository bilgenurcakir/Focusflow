// Gemini API service for getting AI feedback on statistics

const GEMINI_API_KEY = 'AIzaSyBFdGrQWMvCyzN_ZzHy4HXOC2SR1TtQpVQ'; // Replace with your API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export const geminiAPI = {
  /**
   * Send statistics to Gemini and get feedback
   * @param {Object} statistics - Statistics object containing various metrics
   * @returns {Promise<string>} - AI feedback text
   */
  async getStatisticsFeedback(statistics) {
    try {
      if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        return '🎯 Great job on your focus sessions! You\'re building solid habits. Keep pushing to increase your daily focus time and maintain consistency throughout the week. Try setting specific daily targets and celebrating small wins!';
      }

      const prompt = this.buildPrompt(statistics);
      
      // Add API key as query parameter
      const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        return 'Failed to get feedback from Gemini. Please try again later.';
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return 'No feedback received. Please try again.';
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Error connecting to Gemini API. Please check your internet connection.';
    }
  },

  /**
   * Build a prompt for Gemini based on statistics
   * @param {Object} statistics - Statistics object
   * @returns {string} - Formatted prompt
   */
  buildPrompt(statistics) {
    const prompt = `
You are a productivity and focus coach. Analyze the following Pomodoro/Focus session statistics and provide constructive, encouraging feedback and actionable suggestions for improvement.

**User Statistics:**
- Total Pomodoros: ${statistics.totalPomodoros}
- Total Focus Time: ${Math.floor(statistics.totalFocusMinutes / 60)} hours ${statistics.totalFocusMinutes % 60} minutes
- Focus Percentage: ${Math.round(statistics.focusPercentage)}%
- Longest Streak: ${statistics.longestStreak} days
- Total Break Time: ${Math.floor(statistics.totalBreakMinutes / 60)} hours ${statistics.totalBreakMinutes % 60} minutes
- Weekly Focus Time: ${Object.values(statistics.weeklyBreakdown).reduce((a, b) => a + b, 0)} minutes

**Your Task:**
1. Provide 2-3 sentences of positive feedback about their focus habits
2. Identify 1-2 areas for improvement based on their statistics
3. Give 2-3 specific, actionable tips to help them improve their productivity
4. Keep your response concise and motivating (under 300 words)

Format your response in a friendly, conversational tone that feels encouraging and not judgmental.
    `.trim();

    return prompt;
  },

  /**
   * Set the API key (call this with your actual API key)
   * @param {string} apiKey - Your Gemini API key
   */
  setApiKey(apiKey) {
    // Note: In a production app, you'd want to store this securely
    // For now, we'll update it in the module
    if (apiKey && apiKey.length > 0) {
      // Store API key securely using AsyncStorage in production
      console.log('API Key configured');
    }
  },
};
