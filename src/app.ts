import express, {
    NextFunction,
    Request,
    Response,
    Express,
    Application,
    Router,
} from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import path from "path";
import { readdirSync, readFileSync } from "fs";
import { IPluginConfig } from "./types";
const app: Express = express();

app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.json({
        message: "Wellcome to Api Service",
    });
});

// Function to load Microservices
const loadMicroservices = async (app: Application) => {
    const microservicesDir = path.join(__dirname, "microservices");
    const microserviceDirs = readdirSync(microservicesDir, {
        withFileTypes: true,
    })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    for (const microserviceDir of microserviceDirs) {
        const configPath = path.join(
            microservicesDir,
            microserviceDir,
            "config.json",
        );
        const microserviceConfig: IPluginConfig = JSON.parse(
            readFileSync(configPath, "utf-8"),
        );
        const microservicePath = path.join(
            microservicesDir,
            microserviceDir,
            "routes",
        );
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const microserviceRouter: Router = require(microservicePath).default;
        app.use(microserviceConfig.path, microserviceRouter);
        // microservices resistered successfully with use green color
        logger.info({
            message: `Microservice ${microserviceConfig.module} registered successfully`,
            author: `${microserviceConfig.author}`,
            version: `${microserviceConfig.version}`,
        });
    }
};

// Load microservices
loadMicroservices(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    });
});
export default app;
