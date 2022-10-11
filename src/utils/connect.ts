import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connectToDB() {
    const dbUri = config.get<string>("dbUri");

    try {
        await mongoose.connect(dbUri);
        logger.info("App is connected to the DB.");
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

export default connectToDB;
