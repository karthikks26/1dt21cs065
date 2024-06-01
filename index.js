const express = require("express");
const axios = require("axios");

const app = express();
const port = 9876;

const windowSize = 10;
let storedNumbers = [];

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjE4NDE3LCJpYXQiOjE3MTcyMTgxMTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZmMDBkZWVlLTQxNzEtNDJiZC05NGM4LWI0MDFiNTZjNDMzZiIsInN1YiI6ImthcnRoaWtrczI2MDcwM0BnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJBZmZvcmRNZWQiLCJjbGllbnRJRCI6IjZmMDBkZWVlLTQxNzEtNDJiZC05NGM4LWI0MDFiNTZjNDMzZiIsImNsaWVudFNlY3JldCI6ImZZbG5vaGFReVlhYUFDdFEiLCJvd25lck5hbWUiOiJLYXJ0aGlra3MiLCJvd25lckVtYWlsIjoia2FydGhpa2tzMjYwNzAzQGdtYWlsLmNvbSIsInJvbGxObyI6IjFkdDIxY3MwNjUifQ.hjQZbi1LgLjtkUsQOXM7G-3_rnIR1KksO1DNZS_WA_A";

const fetchNumbers = async (numberId) => {
  try {
    const response = await axios.get(`http://20.244.56.144/test/${numberId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    console.log("mmmmmmmmmmmmm", response);
    return response.data.numbers;
  } catch (error) {
    console.error("Failed to fetch numbers from the test server");
    return null;
  }
};

const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

app.get("/numbers/:numberId", async (req, res) => {
  const { numberId } = req.params;

  const numbers = await fetchNumbers(numberId);
  if (numbers === null) {
    return res
      .status(500)
      .json({ error: "Failed to fetch numbers from the test server" });
  }

  storedNumbers = [...new Set([...storedNumbers, ...numbers])];

  if (storedNumbers.length > windowSize) {
    storedNumbers = storedNumbers.slice(-windowSize);
  }

  const avg = calculateAverage(storedNumbers);

  const response = {
    numbers: numbers,
    windowPrevState: storedNumbers.slice(0, -numbers.length),
    windowCurrState: storedNumbers,
    avg: avg.toFixed(2),
  };

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
