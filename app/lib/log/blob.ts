import { put } from "@vercel/blob";

export async function writeLog(time: string,provider: string, content: string) {
    const fileName = `/qwnl/${time}_${provider}.json`;

    await put(fileName, content, {
        access: "public",
    });

    return fileName;
}
