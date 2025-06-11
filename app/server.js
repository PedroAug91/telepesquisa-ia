import app from "./src/app.js";
import { conn, insertIntoDB } from "./src/db.js";

await conn.setCollection();

conn.collection.count()
    .then((num) => {
        // console.log(`[LOG] - ${num}`);
        if (num !== 0) {
            console.log("[LOG] - Data already in db.");
        } else {
            insertIntoDB().then((_) => {
                console.log("[LOG] - Inserted CSV data into db.");
            });
        }
    });


const PORT = process.env.BACKEND_PORT
app.listen(PORT, (_) => {
    console.log(`[LOG] - Listening at port ${PORT}`);
});
