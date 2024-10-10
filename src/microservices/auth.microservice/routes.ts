import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Wellcome to  Auth Service",
    });
});

export default router;
