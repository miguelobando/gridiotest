const axios = require('axios');
const sqlite3 = require('sqlite3');
const url = 'https://dashboard.elering.ee//api/nps/price/EE/current';
let db = new sqlite3.Database('./db/prices.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the DB');
  });
  
  let scraper = () =>{ 
    axios.get(url)
        .then((response) => {
            let unix_date = response.data.data[0].timestamp;

            let date = new Date(unix_date * 1000);
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDay();
            let hours = date.getHours();
            let minutes = "0" + date.getMinutes();
            let seconds = "0" + date.getSeconds();
            let formattedTime = day+"-"+
                                month+"-"+
                                year
                                +"T"
                                +hours 
                                + ':' + minutes.substr(-2) 
                                + ':' + seconds.substr(-2);
            let price = response.data.data[0].price; 
            db.run(`INSERT INTO  energy_price (time,prices) VALUES('${formattedTime}',${price});`);
            console.log( formattedTime ," price: ",price );
          }).catch((err) => {
            console.log(err);
        });
    
};

  scraper();

  setInterval(() => {
    scraper();
  }, 3600000 );

