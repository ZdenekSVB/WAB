import * as dotenv from 'dotenv'; // Namespace import
import * as path from 'path'; // Namespace import

// Load environment variables from .env.test
console.log('Loaded TEST_MONGO_URI:', process.env.TEST_MONGO_URI);
dotenv.config({ path: path.resolve(__dirname, '.env.test') });