import React, { useState } from "react";
import CardContent from "./components/CardContent";
import Card from "./components/Card";
import Input from "./components/Input";
import Button from "./components/Button";
import axios from "axios";


const ChatPage = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: "llm", text: "Olá! Sou a IA da Telepesquisa, como posso te ajudar hoje?" },
    ]);

    const handleSend = async (_) => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        const PORT = 3000;

        const response = await axios.post(`http://localhost:${PORT}/chat`,{
            userId: 1,
            prompt: input,
        });

        let message;

        console.log(response.data.data)
        if (response.data.data.tipo_resposta === "lista_empresas") {
            message = JSON.stringify(response.data.data.empresas);
        } else {
            message = response.data.data.mensagem;
        }

        const llmMessage = { sender: "llm", text: message };
        setMessages((prev) => [...prev, llmMessage]);
    };

    return (
        <div className="max-w-3xl mx-auto border-1 border-gray-300 rounded-xl my-6">
            <Card className="flex flex-col justify-between px-4 pb-4 h-[600px]">
                <CardContent className="overflow-y-auto">
                    <div className="flex-1 overflow-y-auto px-3 py-1">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-xl max-w-[40%] break-words whitespace-pre-wrap ${ msg.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100 mr-auto" }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardContent>
                    <div className="flex content-between gap-2">
                        <Input
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="border rounded-sm border-gray-200 px-2 min-w-[80%]"
                        />
                        <Button onClick={handleSend} className="rounded-sm bg-blue-400 hover:bg-blue-500 px-3 py-1 text-white font-bold min-w-[20%] cursor-pointer">
                            Enviar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChatPage;
