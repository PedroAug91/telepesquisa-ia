import { ChatOpenAI } from "@langchain/openai";
import { 
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import { z } from "zod";
import { chatbotPromptTemplate, dataPromptTemplate } from "./promptTemplates.js";

const llm = new ChatOpenAI({
    temperature: 0.4,
    apiKey: process.env.API_KEY,
    model: "gpt-4o-mini",
});

const nonEmptyString = z.string().transform((s) => s.trim() || null);
const schema = z.object({
    nomeEmpresa: z.nullable(nonEmptyString).describe("O nome da empresa citada pelo cliente."),
    localizacao: z.object({
        cidade: z.boolean().describe("O nome da cidade."),
        estado: z.boolean().describe("O nome do estado."),
    }),
    tipoResposta: z.null()
});

const llmWithSchema = llm.withStructuredOutput(schema);

async function callModel(state) {
    const dataPrompt = await dataPromptTemplate.invoke(state);

    const schemaResponse = await llmWithSchema.invoke(dataPrompt);

    const hasEnoughInfo = !!schemaResponse.localizacao.cidade
        || !!schemaResponse.localizacao.estado 
        || !!schemaResponse.nomeEmpresa

    if (hasEnoughInfo) {
        return {
            messages: [...state.messages], parsedData: schemaResponse
        }
    }

    const prompt = await chatbotPromptTemplate.invoke(state);
    const response = await llm.invoke(prompt);

    return { messages: [...state.messages, response], parsedData: null };
}

const workflow = new StateGraph({
    channels: {
        messages: MessagesAnnotation,
        parsedData: "json",
    }
})

workflow
    .addNode("callModel", callModel)
    .addEdge(START, "callModel")
    .addEdge("callModel", END);


const llmWithMemory = workflow.compile({ checkpointer: new MemorySaver() });

export default llmWithMemory;
