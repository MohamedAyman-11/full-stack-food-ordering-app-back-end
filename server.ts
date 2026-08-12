import './config/env';
import app from './app';
const PORT = process.env.PORT
import db from './lib/prisma';
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})