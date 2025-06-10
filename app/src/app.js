import e from "express";
import logger from "./utils/logger.js";

const app = e();

app.use(e.json());
app.use(logger);

app.get("/", (_req, res) => {
    res.status(200).json({
        theSla: "oi"
    });
});

function errorHandling(err, _req, res, _next) {
    const status = err.status || err.statusCode || 500;
    const resMessage = err.resMessage || err.message;
    const errMessage = err.message || "Internal Server Error";

    console.error(errMessage);

    res.status(status);
    res.json({
        success: false,
        data: {
            tipo_resposta: "Erro ao executar operação",
            mensagem: resMessage
        }
    })
}

app.use(errorHandling);

export default app;
