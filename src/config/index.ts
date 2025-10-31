import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt: process.env.BCRYPT_SALT,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  jwt_secret: process.env.JWT_SECRET,
  JWT_ACCESS : process.env.JWT_ACCESS_EXPIRES,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
  
  openRouterApiKey: process.env.OPEN_ROUTER_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  WEBHOOK_SECRET : process.env.WEBHOOK_SECRET,
  RESET_PASS_LINK: process.env.RESET_PASS_LINK,
  RESET_PASS_TOKEN: process.env.RESET_PASS_TOKEN,
  RESET_PASS_TOKEN_EXPIRES_IN: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  EmailSender:{
    EMAIL: process.env.EMAIL,
    APP_PASS: process.env.APP_PASS
  }
};
