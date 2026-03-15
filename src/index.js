import { app } from "./app.js";
import { configDotenv } from "dotenv";
import connectDB from "./db/index.js";
configDotenv({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT ${process.env.PORT}`);
    });

    app.on("error", (error) => {
        console.log(`ERROR ${error}`);
        throw error;
    });
})
.catch((err) => {
    console.log(`MONGO db connection failed!! ${err}`);
})