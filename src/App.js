import './App.css';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const URL = "https://openapiv1.coinstats.app/coins";

  useEffect(() => {

    fetch(URL, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-KEY": API_KEY
      },
    })
      .then(res => res.json())
      .then(json => {
        setCrypto(json.result);
      });
  });



  return (
    <div className="App">
      <h1>All Cryptocurrencies</h1>
      <input
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
      />
      <table>
        <thead>
          <tr>
            <td>Rank</td>
            <td>Name</td>
            <td>Symbol</td>
            <td>Market Cap</td>
            <td>Price</td>
            <td>Available Supply</td>
            <td>Volume (24 hours)</td>
          </tr>
        </thead>
        <tbody>
          {crypto
            .filter((search_value) => {
              return search_value.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((value, id) => {
              return(
                <>
                  <tr id={id} key={uuidv4()}>
                    <td className="rank">{value.rank}</td>
                    <td className="logo">
                        <a href={value.websiteUrl}>
                            <img src={value.icon} alt="logo" width="30px" />
                        </a>

                        <p>{value.name}</p>

                    </td>
                    <td className="symbol">{value.symbol}</td>
                    <td>₹{value.marketCap}</td>
                    <td>₹{value.price.toFixed(2)}</td>
                    <td>{value.availableSupply}</td>
                    <td>{value.volume.toFixed(0)}</td>
                  </tr>
                </>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
