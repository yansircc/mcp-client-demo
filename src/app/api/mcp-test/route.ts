import { OpenAI } from "openai";


export async function POST(req: Request) {
  try {
    console.log('MCP Chat API called');
    const { message } = await req.json();
    console.log('Received message:', message);

    // 检查 OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.responses.create({
      model: "gpt-4.1",
      input: message,
      tools: [{
        type: "mcp",
        server_label: "zetar",
        server_url: process.env.MCP_SERVER_URL!,
        headers: {
          "mcp-send-key": "sk_1234567890",
          "mcp-sc-key": "SCT1234567890"
        },
        require_approval: "never",
      }],
    });

    console.log(result.output);

    const msg = result.output.find((item: any) => item.type === "message") as any;

    if (msg) {
      return Response.json(msg.content[0].text);
    }

    return Response.json(result.output);
  } catch (error) {
    console.error('MCP Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 