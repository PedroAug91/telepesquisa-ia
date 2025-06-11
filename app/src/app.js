import e from "express";
import logger from "./utils/logger.js";
import AppError from "./utils/appError.js";
import cors from "cors";
import llmWithMemory from "./agent/llm.js";
import { conn, getCompanies } from "./db.js";
const app = e();

app.use(e.json());
app.use(logger);
app.use(cors());

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

app.post("/chat", async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const prompt = req.body.prompt;

        const hasIdAndPrompt = !!userId && !!prompt;

        if (!hasIdAndPrompt) {
            res.status(400).json({
                success: false,
                data: {
                    tipo_resposta: "dados_insuficientes",
                    mensagem: "Não foi possível concluir a operação"
                }
            })
        }

        const config = { configurable: { thread_id: userId }};
        const response = await llmWithMemory.invoke({ messages: prompt }, config);

        const messages = response.messages;
        const responseType = !!response.parsedData ? "lista_empresas" : "mais_informacoes_necessarias"

        if (responseType === "mais_informacoes_necessarias") {
            res.status(200).json({
                success: true,
                data: {
                    tipo_resposta: "mais_informacoes_necessarias",
                    mensagem: messages[messages.length - 1].content,
                },
            });
        } 

        const companies = await getCompanies(prompt);

        res.status(200).json({
            success: true,
            data: {
                tipo_resposta: "lista_empresas",
                mensagem: companies,
            },
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
