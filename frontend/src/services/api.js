/**
 * Fetches all necessary data for the main dashboard from the backend.
 * @returns {Promise<any>} A promise that resolves to the dashboard data.
 */
export const getDashboardData = async () => {
    const response = await fetch('/api/dashboard');
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch dashboard data: ${errorText}`);
    }
    return response.json();
};

/**
 * Fetches the 7-day solar generation forecast.
 * @returns {Promise<any>} A promise that resolves to the forecast data.
 */
export const getWeatherForecast = async () => {
    const response = await fetch('/api/weather-forecast');
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch weather forecast: ${errorText}`);
    }
    return response.json();
};

/**
 * Submits the contact form data to the backend.
 * @param {object} formData - The form data object.
 * @returns {Promise<any>} A promise that resolves to the server's response.
 */
export const submitContactForm = async (formData) => {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message.');
    }

    return response.json();
};

/**
 * Sends a prompt to the backend AI chat service.
 * @param {string} prompt - The user's message for the chatbot.
 * @returns {Promise<any>} A promise that resolves to the AI's response object.
 */
export const getAIChatResponse = async (prompt) => {
    const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response.');
    }

    return response.json();
};