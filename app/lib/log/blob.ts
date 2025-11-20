import { put } from "@vercel/blob";

export async function writeLog(time: string,provider: string, content: string) {
    const fileName = `/qwnl/${time}_${provider}.txt`;

    await put(fileName, content, {
        access: "public",
    });

    return fileName;
}
