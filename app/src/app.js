import e from "express";
import logger from "./utils/logger.js";
import AppError from "./utils/appError.js";
const app = e();

app.use(e.json());
app.use(logger);

app.get("/", (_req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                tipo_resposta: "Funcionando",
                mensagem: "O servidor está funcionando corretamente."
            }
        });
    } catch (err) {
        next(new AppError(err));
    }
});

app.get("/chat", (_req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                tipo_resposta: "Thesla",
                mensagem: "Mensagem do the sla."
            }
        });
    } catch (err) {
        next(new AppError(err));
    }
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
