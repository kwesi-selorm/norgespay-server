import express from "express";

const logoutRouter = express.Router();

logoutRouter.post("/", (req, res) => {
    const cookies = req.cookies;
    if (!cookies["connect.sid"]) return res.sendStatus(204);
    res.clearCookie("connect.sid", {
        secure: false,
        maxAge: 30 * 1000,
        httpOnly: true,
        sameSite: "none",
    }).send();
});

export default logoutRouter;
