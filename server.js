// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

const API_KEY = process.env.FOOTBALL_DATA_API_KEY || 'db9d234b98fb448db903370727e3d1dd';
const API_URL = 'https://api.football-data.org/v4/matches';

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Matches API endpoint
app.get('/api/matches', async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-Auth-Token': API_KEY
      },
      params: {
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        competitions: 'PL,CL,EL,EC' // Premier League, Champions League, etc.
      }
    });

    const matches = response.data.matches.map(match => ({
      id: match.id,
      homeTeam: match.homeTeam.shortName || match.homeTeam.name,
      awayTeam: match.awayTeam.shortName || match.awayTeam.name,
      date: match.utcDate,
      competition: match.competition.name
    }));

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
