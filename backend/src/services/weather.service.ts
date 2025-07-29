import axios from 'axios';
import { getRawProjectData } from './projectData.service';

const get7DayForecast = async () => {
    const lat = 3.1412;
    const lon = 101.6865;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=cloudcover_mean&timezone=Asia%2FSingapore`;

    type WeatherData = {
        daily: {
            time: string[];
            cloudcover_mean: number[];
        };
    };
    const weatherResponse = await axios.get<WeatherData>(url);
    return weatherResponse.data;
};

export const getForecastedGeneration = async (p0: { latitude: number | undefined; longitude: number | undefined; }) => {
    try {
        const [weatherData, projectData] = await Promise.all([
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

        return forecast;

    } catch (error) {
        console.error("Error in getForecastedGeneration service:", error);
        throw error;
    }
};