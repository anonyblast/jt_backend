import { createServer } from 'http';
import app from './src/app.js';
const PORT = process.env.PORT || 3300;
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});