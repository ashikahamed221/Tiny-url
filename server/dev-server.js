import "dotenv/config";
import app from "./index.js";

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Tiny URL API listening on port ${port}`);
});
