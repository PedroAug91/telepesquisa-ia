import Papa from "papaparse";
import fs from "fs";
import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";
import { decodeHTML } from "entities";
import path from "path";

class DBConn {
    #client;
    collection;

    constructor() {
        this.#client = new ChromaClient({
            host: "chromadb",
            port: process.env.CHROMADB_PORT,
        });
        this.collection = null;
    }

    async setCollection() {
        this.collection = await this.#client.getOrCreateCollection({
            name: "empresas_telepesquisa",
            embeddingFunction: new DefaultEmbeddingFunction(),
        });
    }
}

const conn = new DBConn();

function formatText(text) {
    const noTagsText = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/g, "");

    return decodeHTML(noTagsText).trim();
}

function readCSVs(filename, status) {
    const currDir = path.dirname(".");
    const filePath = path.join(currDir,"src","files", filename);

    return new Promise((resolve, reject) => {
        const file = fs.createReadStream(filePath);
        const csvData = [];

        Papa.parse(file, { 
            header: true,
            encoding: "utf-8",
            skipEmptyLines: true,
            step: (row) => {
                row.data.nome_empresa = formatText(row.data.nome_empresa);
                row.data.texto = formatText(row.data.texto);
                row.data.atividades = formatText(row.data.atividades);
                row.data.status = status;
                csvData.push(row.data);
            },
            complete: (_) => {
                console.log(`[LOG] - Finished reading contents from ${filename}.`)
                // console.log(csvData[0]);
                resolve(csvData);
            },
            error: (err) => { 
                reject(err)
            },
        });
    });
}

async function insertIntoDB() {
    const [ activeCompanies, inactiveCompanies ] = await Promise.all([
        readCSVs("empresas_ativas.csv", "ativo"),
        readCSVs("empresas_inativas.csv", "inativo"),
    ]);

    const allCompanies = [...activeCompanies, ...inactiveCompanies];

    const dbData = [];

    allCompanies.forEach(async (company) => {
        const baseId = `${company.codigo}_principal`;
        const docs = `Nome: ${company.nome_empresa} Descrição: ${company.texto}`;
        const activities = company.atividades
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
        const contact = company.contatos;

        dbData.push({
            ids: [`${baseId}`],
            documents: [docs],
            metadatas: [{ 
                tipo: "principal", 
                id: baseId,
                nome: company.nome_empresa,
                telefones: contact,
                cidade: company.cidade,
                bairro: company.bairro,
                estado: company.estado,
            }]
        });

        activities.forEach(async (activity) => {
            dbData.push({
                ids: [`${baseId}_atividade_${activity}`],
                documents: [activity],
                metadatas: [{
                    tipo: "atividade",
                    id: baseId,
                }],
            });
        });
    });

    const ids = dbData.flatMap((d) => d.ids);
    const documents = dbData.flatMap((d) => d.documents);
    const metadatas = dbData.flatMap((d) => d.metadatas);

    console.log("[LOG] - Inserting CSV data into db.");
    await conn.collection.add({
        ids: ids,
        documents: documents,
        metadatas: metadatas,
    });
}

async function getCompanies(text) {
    const res = await conn.collection.query({
        nResults: 2,
        queryTexts: [text],
        where: {"status": "ativo"},
    });

    console.log(res.metadatas[0]);
}

export { insertIntoDB, getCompanies, conn }
