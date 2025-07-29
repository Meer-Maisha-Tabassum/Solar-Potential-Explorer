import { Router, Request, Response, NextFunction } from 'express';
import * as projectDataService from './services/projectData.service';
import * as weatherService from './services/weather.service';
import * as contactService from './services/contact.service';
import * as aiService from './services/ai.service';

const router = Router();

/**
 * @route   GET /api/dashboard
 * @desc    Get all pre-calculated data for the main dashboard
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await projectDataService.getDashboardData();
    if (!data) {
      return res.status(404).json({ error: 'Dashboard data not found. Please seed the database.' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/weather-forecast
 * @desc    Get 7-day solar generation forecast for a given location
 */
router.get('/weather-forecast', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { latitude, longitude } = req.query;
    const forecast = await weatherService.getForecastedGeneration({
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined
    });
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/contact
 * @desc    Handle contact form submission
 */
const validateContactForm = (req: Request, res: Response, next: NextFunction) => {
    const { user_name, user_email, message } = req.body;
    if (!user_name || !user_email || !message) {
        return res.status(400).json({ error: 'Validation failed: All fields are required.' });
    }
    next();
};

router.post('/contact', validateContactForm, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactService.sendContactEmail(req.body);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/ai-chat
 * @desc    Get a response from the AI chatbot
 */
router.post('/ai-chat', async (req: Request, res: Response, next: NextFunction) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        const response = await aiService.getChatResponse(prompt);
        res.json({ response });
    } catch (error) {
        next(error);
    }
});

export default router;
