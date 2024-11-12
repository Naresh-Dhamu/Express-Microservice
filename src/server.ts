import app from "./app";
import { Config } from "./config/config";
import logger from "./config/logger";
import DatabaseConnection from "./config/data.source";
const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await DatabaseConnection.connect();
        logger.info("Database connected successfully");
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
