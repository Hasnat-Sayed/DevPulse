import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
  quiet: true,
});

const config = {
  port: process.env.PORT || 3000,
  connection_string: process.env.CONNECTIONSTRING
};

export default config;
