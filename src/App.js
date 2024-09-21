import './App.css';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import { SYMBOLS } from "./Symbols";

function App() {

  const [search, setSearch] = useState("");
  const [crypto, setCrypto] = useState([]);
  const [currencies, setCurrencies] = useState({});
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const URL_COINS = "https://openapiv1.coinstats.app/coins";
  const URL_CURRENCY = "https://openapiv1.coinstats.app/currencies";

  useEffect(() => {

    fetch(URL_COINS, {
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
  }, [API_KEY]);

  useEffect(() => {
    fetch(URL_CURRENCY, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-KEY": API_KEY
      },
    })
      .then(res => res.json())
      .then(json => {
          setCurrencies(json.result);
      });
  }, [API_KEY]);

  function handleCurrencyChange(e) {
    setCurrency(e.target.value);
  }

  useEffect(() => {
    let keys = Object.keys(currencies);
    keys.forEach(key => {
      if(key === currency) {
        setCurrencyMultiplier(currencies[key]);
      }
    });
    let symbol_keys = Object.keys(SYMBOLS);
    symbol_keys.forEach(key => {
      if (key === currency) {
        setSymbol(SYMBOLS[key]);
      }
    });
  }, [currency, currencies]);

  return (
    <div className="App">
      <h1>Cryptocurrencies</h1>
      <input
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
                className="search"
      />
      <select name="currency" id="currency" onChange={handleCurrencyChange} className="dropdown">
        {Object
          .keys(currencies).map((curr) => {
            return (
              <option 
                value={curr} 
                key={curr}
              >
                {curr}
              </option>
            );
          })
        }
      </select>
      <div className="table-container">
        <table className="table">
          <thead className="thead">
            <tr className="trHead">
              <th className="th">Rank</th>
              <th className="th">Name</th>
              <th className="th">Symbol</th>
              <th className="th">Market Cap</th>
              <th className="th">Price</th>
              <th className="th">Available Supply</th>
              <th className="th">Volume (24 hours)</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {crypto
              .filter((search_value) => {
                return search_value.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((value, id) => {
                return(
                  <>
                    <tr id={id} key={uuidv4()} className="trBody">
                      <td className="rank td">{value.rank}</td>
                      <td className="logo td">
                          <a href={value.websiteUrl}>
                              <img src={value.icon} alt="logo" width="30px" />
                          </a>

                          <p>{value.name}</p>

                      </td>
                      <td className="symbol td">{value.symbol}</td>
                      <td className="td">{symbol}{(value.marketCap * currencyMultiplier).toFixed(2)}</td>
                      <td className="td">{symbol}{(value.price * currencyMultiplier).toFixed(2)}</td>
                      <td className="td">{value.availableSupply}</td>
                      <td className="td">{value.volume.toFixed(0)}</td>
                    </tr>
                  </>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
