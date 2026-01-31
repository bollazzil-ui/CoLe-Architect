import { Router } from 'express';
import { supabase } from './db.js';
import { analyzeJobLink, generateCoverLetter } from './gemini.js';

export const router = Router();

router.get('/health', async (req, res) => {
  let supabaseStatus = 'disconnected';

  if (supabase) {
    try {
      supabaseStatus = 'configured';
    } catch (e) {
      supabaseStatus = 'error';
    }
  }

  res.json({
    status: 'ok',
    supabase: supabaseStatus
  });
});

router.post('/analyze-job', async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      res.status(400).json({ error: 'Link is required' });
      return;
    }
    const result = await analyzeJobLink(link);
    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing job:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze job' });
  }
});

router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { job, profile } = req.body;
    if (!job || !profile) {
      res.status(400).json({ error: 'Job details and profile are required' });
      return;
    }
    const result = await generateCoverLetter(job, profile);
    res.json(result);
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate cover letter' });
  }
});
