import { put } from "@vercel/blob";

export async function writeLog(provider: string, content: string) {
    const date = new Date().toISOString().split("T")[0]; // 2025-11-18
    const fileName = `/qwnl/${date}.txt`;

    let previous = "";
    try {
        const res = await fetch(fileName);
        if (res.ok) previous = await res.text();
    } catch {}

    const newContent = previous + "\n" + content;

    await put(fileName, newContent, {
        access: "public",
    });

    return fileName;
}
