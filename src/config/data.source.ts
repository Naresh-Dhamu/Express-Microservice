import mongoose from "mongoose";
import logger from "../config/logger";
import { Config } from "../config/config";

class DatabaseConnection {
    // connect to the database
    public connect(): void {
        mongoose.set("strictQuery", false);
        void mongoose.connect(Config.DB_CONNECTION!);

        mongoose.connection.on("connected", () => {
            logger.info("Connected to database");
        });

        mongoose.connection.on("error", (err) => {
            logger.error("Database connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            logger.info("Disconnected from database");
        });

        process.on("SIGINT", () => {
            logger.info("SIGINT signal received: closing MongoDB connection");
            void this.disconnect();
        });

        process.on("SIGTERM", () => {
            logger.info("SIGTERM signal received: closing MongoDB connection");
            void this.disconnect();
        });
    }

    // disconnect from the database
    public async disconnect(): Promise<void> {
        try {
            await mongoose.connection.close();
            logger.info("Database connection closed due to app termination");
        } catch (error) {
            logger.error("Error while closing the database connection:", error);
        } finally {
            if (Config.NODE_ENV !== "test") {
                process.exit(0);
            }
        }
    }

    // drop the database
    public async dropDatabase(): Promise<void> {
        if (Config.TEST_ENV === "ci") {
            try {
                // delete all collections
                const collections = mongoose.connection.collections;
                for (const key in collections) {
                    if (
                        Object.prototype.hasOwnProperty.call(collections, key)
                    ) {
                        const collection = collections[key];
                        await collection.deleteMany({});
                        // delete all indexes
                        await collection.dropIndexes();
                    }
                }
            } catch (error) {
                logger.error("Error while dropping the database:", error);
            }
        } else {
            try {
                await mongoose.connection.dropDatabase();
            } catch (error) {
                logger.error("Error while dropping the database:", error);
            }
        }
    }
}

export default new DatabaseConnection();
