const db = require('./database');

// Registration endpoint


const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
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