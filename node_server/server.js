//server.js for API endpoints from spotify and supabase

import dotenv from 'dotenv';
import express from 'express'; //create web server using express.js
import axios from 'axios'; //make requests to spotify
import cors from 'cors'; //handle cross-origin resource sharing

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

//allow requests from front-end
app.use(cors());

//endpoint to get spotify access token
app.get('/api/get-spotify-token', async (req, res) => {
    try{
        const clientID = process.env.SPOTIFY_CLIENT_ID;
        const clientSec = process.env.SPOTIFY_CLIENT_SECRET;

        //request body for token generation
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${clientID}:${clientSec}`).toString('base64')}`,
                },
            }
        );
        res.json({
            access_token: tokenResponse.data.access_token,
            expires_in: tokenResponse.data.expires_in,
        });
    }
    catch(error) {
        console.error('Error fetching Spotify token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch Spotify token' });
    }
});

//endpoint to expose spotify configs to front-end
app.get('/api/config', (req, res) => {
    res.json({
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || 'default-spotify-key',
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || 'default-spotify-secret',
    });
});

//endpoint to expose supabase configs to front-end
app.get('/api/supabase-config', (req, res) => {
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL || 'default-url',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'default-key',
    });
});
