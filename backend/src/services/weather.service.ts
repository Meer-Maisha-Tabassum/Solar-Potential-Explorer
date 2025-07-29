import axios from 'axios';
import { getRawProjectData } from './projectData.service';

type WeatherData = {
    daily: {
        time: string[];
        cloudcover_mean: number[];
    };
};

const get7DayForecast = async (): Promise<{ weatherData: WeatherData, locationName: string }> => {
    const lat = 3.1412; // Default to Kuala Lumpur
    const lon = 101.6865;
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=cloudcover_mean&timezone=auto`;
    const weatherResponse = await axios.get(weatherUrl);
    
    const locationName = 'Kuala Lumpur'; // Hardcoded for default

    return { weatherData: weatherResponse.data as WeatherData, locationName };
};

export const getForecastedGeneration = async () => {
    try {
        const [{ weatherData, locationName }, projectData] = await Promise.all([
            get7DayForecast(),
            getRawProjectData()
        ]);

        if (!projectData) {
            throw new Error("Project data not available for forecast calculation.");
        }

        const avgDailyProduction = projectData.monthly_energy_production / 30;

        const forecast = weatherData.daily.time.slice(0, 7).map((time: string, index: number) => {
            const cloudcover = weatherData.daily.cloudcover_mean[index];
            const cloudFactor = 1 - (cloudcover / 100);
            return {
                name: index === 0 ? 'Today' : new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
                "Forecasted Generation (kWh)": avgDailyProduction * cloudFactor
            };
        });

        return { forecast, locationName };

    } catch (error) {
        console.error("Error in getForecastedGeneration service:", error);
        throw error;
    }
};
