import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config()
const configService = new ConfigService()


export const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  configService.get('FRONTEND_BASE_URL')
];
