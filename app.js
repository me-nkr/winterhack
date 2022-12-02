import express from 'express';
import './src/helpers/dbConnect.js';
import errorHandler from './src/helpers/errorHandler.js';

import userRoutes from './src/routes/userRoute.js';
import orgRoutes from './src/routes/orgRoutes.js';


const app = express();

app.use(express.json());

// Welcome
app.get('/', (req, res) => res.send('Welcome to EatBetter'))

// Identity
app.use('/user', userRoutes);
app.use('/org', orgRoutes);

// Operations
// app.use('/admin')
// app.use('/inventory')
// app.use('./issues')

app.use(errorHandler);

app.listen(process.env.PORT || 3000);