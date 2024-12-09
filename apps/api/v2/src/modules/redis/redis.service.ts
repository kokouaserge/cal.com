import { AppConfig } from "@/config/type";
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  public redis: Redis;
  private readonly logger = new Logger("RedisService");

  constructor(readonly configService: ConfigService<AppConfig>) {
    const dbUrl = configService.get<string>("db.redisUrl", { infer: true });
    if (!dbUrl) throw new Error("Misconfigured Redis, halting.");
    const parsedURL = new URL(dbUrl);

    this.redis = new Redis({
      host: parsedURL.hostname,
      port: Number(parsedURL.port),
      username: parsedURL.username,
      password: decodeURIComponent(parsedURL.password),
    });
    this.redis.on("error", (err) => {
      this.logger.error(`Erreur Redis : ${err.message}`);
    });
    this.redis.ping((err, pong) => {
      if (err) {
        this.logger.error(`Impossible de se connecter à Redis : ${err.message}`);
        throw err;
      }

      if (pong !== "PONG") {
        this.logger.error("Réponse inattendue de Redis lors du ping");
        throw new Error("Réponse inattendue de Redis lors du ping");
      }

      console.log("Redis initialisé");
    });
  }

  async onModuleDestroy() {
    try {
      await this.redis.quit();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
