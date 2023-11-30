const fs = require("fs");
const express = require("express");
const app = express();
const port = 8000;

//This app will run on http://localhost:8000

app.use(express.json());

//Assignment-1
app.get("/a1", async (req, res) => {
  const obj = await fetch("https://catfact.ninja/breeds ", { method: "GET" });
  let responseData = await obj.json();

  //1) Logging the Response to a text file
  fs.writeFileSync(
    "./response-data.txt",
    JSON.stringify(responseData, null, "\t")
  );

  //2) Logging the number of pages to the console
  const page_count = responseData.last_page;
  console.log(`The number of pages of data is ${page_count}`);

  let cat_list = responseData.data;
  let next_page_url = responseData.next_page_url;

  //3) Getting data from all pages
  while (next_page_url != null) {
    const obj = await fetch(next_page_url, { method: "GET" });

    responseData = await obj.json();
    next_page_url = responseData.next_page_url;

    cat_list = cat_list.concat(responseData.data);
  }

  //4) Grouping cat breeds by country
  const cat_dict = {};
  for (let j = 0; j < cat_list.length; j++) {
    const cat = cat_list[j];
    const country = cat.country;
    const catDetails = {
      breed: cat.breed,
      origin: cat.origin,
      coat: cat.coat,
      pattern: cat.pattern,
    };

    if (country in cat_dict) cat_dict[country].push(catDetails);
    else cat_dict[country] = [catDetails];
  }

  //4a) Returning cat breeds grouped by country
  res.json({ catData: cat_dict });
});

//Assignment-2
app.post("/a2", (req, res) => {
  //The number of words in a sentence = 1 + number of spaces in the sentence
  if (!req.body.str)
    res.status(422).send("The key in the object should be called str");

  const str = req.body.str.trim();
  //Getting str from the request body and trimming it to remove unnecessary whitespace at the beginning and the end (if any)

  const exp = /\s/g;
  //A regular expression; this represents any appearance of whitespace

  const appearances = str.match(exp);
  // This will give a list of all appearances of whitespace

  const wordCount = appearances.length + 1;
  //Finding the number of whitespaces and adding 1 to it to get number of words

  if (wordCount >= 8) res.status(200).send("OK");
  else res.status(422).send("Not Acceptable");
});

app.listen(port, () => {
  console.log(`App is listening at port ${8000}`);
});
