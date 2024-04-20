const db = require('./database');



const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // or '*' for a wildcard
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable this if your frontend is to send cookies with the request
};
app.use(cors(corsOptions));



app.use(express.json()); // For parsing application/json

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/api/cities', (req, res) => {
    const query = 'SELECT DISTINCT city FROM multiplexes ORDER BY city;';
    db.query(query, (error, results) => {
        if (error) throw error;
        res.json(results.map(cityObj => cityObj.city));
    });
});


const bcrypt = require('bcrypt');
app.post('/register', async (req, res) => {
  try {
    // Destructure the user input
    const { fullName, email, password, phoneNumber } = req.body;

    
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        return res.status(500).send('Server error');
      }

      if (results.length > 0) {
        return res.status(409).send('An account with this email already exists.');
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        db.query('INSERT INTO users SET ?', {
          full_name: fullName,
          email: email,
          password: hashedPassword,
          phone_number: phoneNumber // Insert the phone number
        }, (error, results) => {
          if (error) {
            return res.status(500).send('Server error');
          }
          return res.status(201).send('User registered');
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Query the database for the user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error retrieving user' });
    }
    if (results.length > 0) {
      const user = results[0];

      // Compare the plaintext password with the hashed password from the database
      bcrypt.compare(password, user.password, (bcryptError, isMatch) => {
        if (bcryptError) {
          return res.status(500).json({ message: 'Password comparison error' });
        }

        if (isMatch) {
          // Passwords match, return the login success response
          return res.json({ message: 'Login successful', user: { fullName: user.full_name, email: user.email } });
        } else {
          // Passwords do not match, return the invalid credentials response
          return res.status(401).json({ message: 'Invalid email or password' });
        }
      });
    } else {
      // No user found with that email address
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

app.get('/api/movies', (req, res) => {
    // Extract query parameters
    const { language, genre, screen_type } = req.query;
    let query = `
        SELECT movie_id, title, poster_url, genre, language
        FROM movies
        WHERE 1 = 1
    `;

    // Append conditions based on the presence of filters
    if (language) {
        query += ` AND language = ${db.escape(language)}`;
    }
    if (genre) {
        query += ` AND genre = ${db.escape(genre)}`;
    }
    

    // Execute the query
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error retrieving movies with filters', error });
        }
        res.json(results);
    });
});


function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

app.get('/api/movie/:id', (req, res) => {
  const { id } = req.params;

  // First, get the movie details
  db.query('SELECT * FROM movies WHERE movie_id = ?', [id], (err, movieResults) => {
    if (err) {
      console.error('Error fetching movie details:', err);
      return res.status(500).json({ message: "Error fetching movie details", error: err });
    }

    // Check if movie was found
    if (movieResults.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Now, get the cast details
    const movie = movieResults[0]; // Assuming query returns an array of results
   db.query(`
      SELECT cm.name, cm.profile_pic_url, mc.role 
      FROM cast_members cm 
      JOIN movie_cast mc ON cm.cast_id = mc.cast_id 
      WHERE mc.movie_id = ?`,
      [id], (err, castResults) => {
        if (err) {
          console.error('Error fetching cast details:', err);
          return res.status(500).json({ message: "Error fetching cast details", error: err });
        }

        // Send both movie and cast information as response
        res.json({ movie, cast: castResults });
      }
    );
  });
});

// Backend Endpoint to Fetch Shows for a specific movie
app.get('/api/shows/:movie_id', async (req, res) => {
    const { movie_id } = req.params;
    const { show_date, city } = req.query;

    const query = `
        SELECT shows.show_id, shows.start_time, shows.screen_number, multiplexes.name as multiplex_name, multiplexes.address
        FROM shows
        JOIN multiplexes ON shows.multiplex_id = multiplexes.id
        WHERE shows.movie_id = ? AND (? IS NULL OR shows.show_date = ?) AND (? IS NULL OR multiplexes.city = ?)
        ORDER BY shows.start_time;
    `;

     try {
        const results = await query(query, [movie_id, show_date, show_date, city, city]);
        console.log('Shows:', results); // Log the results to see what data is coming back
        res.json(results);
    } catch (error) {
        console.error('Error fetching shows:', error);
        res.status(500).json({ message: "Error fetching shows", error });
    }
});

const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/send-email', async (req, res) => {
  const { to, subject,text } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send({ message: 'Email successfully sent!' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to send email' });
  }
});

