import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import pg from "pg";

const { Client } = pg;

// Veritabanı bağlantısı
const dbConfig = {
  connectionString: process.env.DATABASE_URL || "postgres://zuhre_user:your_strong_db_password@localhost:5432/zuhre_db",
};

const server = new Server(
  {
    name: "zuhre-db-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Mevcut araçları listele
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_escorts",
        description: "Şehre göre escort profillerini listeler.",
        inputSchema: {
          type: "object",
          properties: {
            city: { type: "string", description: "Filtrelenecek şehir adı" },
          },
          required: ["city"],
        },
      },
      {
        name: "create_appointment",
        description: "Yeni bir randevu oluşturur.",
        inputSchema: {
          type: "object",
          properties: {
            customerId: { type: "number", description: "Müşteri ID (User ID)" },
            escortId: { type: "number", description: "Escort ID (Profile ID)" },
            date: { type: "string", description: "Randevu tarihi (YYYY-MM-DD)" },
            time: { type: "string", description: "Randevu saati (HH:mm)" },
            duration: { type: "number", description: "Süre (dakika)" },
            price: { type: "number", description: "Ücret" },
          },
          required: ["customerId", "escortId", "date", "time", "duration", "price"],
        },
      },
      {
        name: "run_query",
        description: "Özel bir SQL sorgusu çalıştırır (Sadece okuma/SELECT önerilir).",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Çalıştırılacak SQL sorgusu" },
          },
          required: ["query"],
        },
      },
    ],
  };
});

/**
 * Araç çağrılarını işle
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const client = new Client(dbConfig);
  await client.connect();

  try {
    switch (request.params.name) {
      case "get_escorts": {
        const city = request.params.arguments.city;
        const result = await client.query(
          "SELECT * FROM escort_profiles WHERE city = $1 AND visibility_status = 'public'",
          [city]
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }],
        };
      }

      case "create_appointment": {
        const { customerId, escortId, date, time, duration, price } = request.params.arguments;
        const result = await client.query(
          "INSERT INTO appointments (customer_id, escort_id, date, time, duration, price, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *",
          [customerId, escortId, date, time, duration, price]
        );
        return {
          content: [{ type: "text", text: "Randevu başarıyla oluşturuldu: " + JSON.stringify(result.rows[0]) }],
        };
      }

      case "run_query": {
        const query = request.params.arguments.query;
        const result = await client.query(query);
        return {
          content: [{ type: "text", text: JSON.stringify(result.rows, null, 2) }],
        };
      }

      default:
        throw new Error("Araç bulunamadı.");
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Hata: ${error.message}` }],
      isError: true,
    };
  } finally {
    await client.end();
  }
});

/**
 * Sunucuyu başlat
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Zuhre DB MCP Server çalışıyor (stdio)");
}

main().catch((error) => {
  console.error("Server başlatılamadı:", error);
  process.exit(1);
});
