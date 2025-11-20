import { ApiPath } from "@/app/constant";
import { NextRequest } from "next/server";
import { writeLog } from "@/app/lib/log/blob";
import { handle as openaiHandler } from "../../openai";
import { handle as azureHandler } from "../../azure";
import { handle as googleHandler } from "../../google";
import { handle as anthropicHandler } from "../../anthropic";
import { handle as baiduHandler } from "../../baidu";
import { handle as bytedanceHandler } from "../../bytedance";
import { handle as alibabaHandler } from "../../alibaba";
import { handle as moonshotHandler } from "../../moonshot";
import { handle as stabilityHandler } from "../../stability";
import { handle as iflytekHandler } from "../../iflytek";
import { handle as deepseekHandler } from "../../deepseek";
import { handle as siliconflowHandler } from "../../siliconflow";
import { handle as xaiHandler } from "../../xai";
import { handle as chatglmHandler } from "../../glm";
import { handle as proxyHandler } from "../../proxy";
import { handle as ai302Handler } from "../../302ai";

async function handle(
  req: NextRequest,
  { params }: { params: { provider: string; path: string[] } },
) {

    let body: any = null;
    // 克隆 request，日志读取用
    const logReq = req.clone();

    // 把 body 作为字符串读取（避免二次 JSON 解析）
    // 解析 Body（流式 POST 也不会报错）
    if (req.method === "POST") {
        try {
            body = await logReq.json();
        } catch {
            body = "[Stream or non-JSON body]";
        }
    }

    // Headers（脱敏）
    const safeHeaders = Object.fromEntries(
        Array.from(logReq.headers.entries()).map(([k, v]) => {
            if (k.includes("key") || k.includes("token") || k.includes("auth")) {
                return [k, "***"];
            }
            return [k, v];
        })
    );

    // 📌 写入请求日志
    await writeLog(
        params.provider,
        [
            "----------------------------",
            `TIME:     ${new Date().toISOString()}`,
            `METHOD:   ${logReq.method}`,
            `PROVIDER: ${params.provider}`,
            `PATH:     /${params.path.join("/")}`,
            `QUERY:    ${logReq.url.split("?")[1] || ""}`,
            `HEADERS:  ${JSON.stringify(safeHeaders)}`,
            `BODY:     ${JSON.stringify(body, null, 2)}`,
            "",
        ].join("\n")
    );


    const apiPath = `/api/${params.provider}`;
  console.log(`[${params.provider} Route] params `, params);
  switch (apiPath) {
    case ApiPath.Azure:
      return azureHandler(req, { params });
    case ApiPath.Google:
      return googleHandler(req, { params });
    case ApiPath.Anthropic:
      return anthropicHandler(req, { params });
    case ApiPath.Baidu:
      return baiduHandler(req, { params });
    case ApiPath.ByteDance:
      return bytedanceHandler(req, { params });
    case ApiPath.Alibaba:
      return alibabaHandler(req, { params });
    // case ApiPath.Tencent: using "/api/tencent"
    case ApiPath.Moonshot:
      return moonshotHandler(req, { params });
    case ApiPath.Stability:
      return stabilityHandler(req, { params });
    case ApiPath.Iflytek:
      return iflytekHandler(req, { params });
    case ApiPath.DeepSeek:
      return deepseekHandler(req, { params });
    case ApiPath.XAI:
      return xaiHandler(req, { params });
    case ApiPath.ChatGLM:
      return chatglmHandler(req, { params });
    case ApiPath.SiliconFlow:
      return siliconflowHandler(req, { params });
    case ApiPath.OpenAI:
      return openaiHandler(req, { params });
    case ApiPath["302.AI"]:
      return ai302Handler(req, { params });
    default:
      return proxyHandler(req, { params });
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
export const preferredRegion = [
  "arn1",
  "bom1",
  "cdg1",
  "cle1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];
