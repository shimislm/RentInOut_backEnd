const mongoose = require('mongoose');
const { config } = require('../config/config');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.vvexxth.mongodb.net/RentInout`);
    console.log("mongo connect...")
}