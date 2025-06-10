import app from "./src/app.js";

const PORT = process.env.APP_PORT
app.listen(PORT, (_) => {
    console.log(`[LOG] - Listening at port ${PORT}`);
});
