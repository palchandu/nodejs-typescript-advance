import mongoose from "mongoose";
import config from "config";
import logger from './logger'
async function connect() {
    const dbUri = config.get<string>('dbUri');
    try {
        await mongoose.connect(dbUri);
        logger.info('Connected to database');
    } catch (err) {
        logger.error('Failed to connect to database');
        process.exit(1);
    }
}

export default connect;