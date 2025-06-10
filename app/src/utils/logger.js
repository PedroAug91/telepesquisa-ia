import { DateTime } from "luxon";

function logger(req, res, next) {
    const dateTimeObject = DateTime.now().setZone("America/Recife");

    const dateTime = dateTimeObject.toLocaleString({
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const status = res.statusCode || "";
    const method = req.method || "";
    const path = req.path || "";
    const ip = req.ip || "";

    const log = `${ip} [${dateTime}] "${method} ${path} ${status}"`;

    console.log(log);
    
    next();
}

export default logger;
