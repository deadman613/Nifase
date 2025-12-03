import { NextResponse } from "next/server";
import { ensureAdminApi } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/request-info";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE_BYTES = 32 * 1024 * 1024;

export async function POST(request) {
  try {
    const session = await ensureAdminApi(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Image hosting is not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Images must be 32 MB or smaller" }, { status: 400 });
    }

    const originalName = file.name || "upload.bin";
    const extension = originalName.includes(".") ? `.${originalName.split(".").pop()}`.toLowerCase() : "";
    if (extension && !ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const sanitizedName = originalName.replace(/[^a-z0-9.\-]/gi, "_") || "upload";

    const upstreamFormData = new FormData();
    upstreamFormData.append("image", base64Image);
    upstreamFormData.append("name", sanitizedName.replace(/\.[^.]+$/, ""));

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      body: upstreamFormData,
    });

    const payload = await imgbbResponse.json().catch(() => null);

    if (!imgbbResponse.ok || !payload?.success) {
      const errorMessage = payload?.error?.message || payload?.data?.error || "Unable to reach image host";
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    const ip = await getClientIp(request);
    await recordAudit("upload.image", {
      actor: session.sub,
      entity: "Upload",
      entityId: payload.data.id,
      ip,
      metadata: {
        originalName,
        size: file.size,
        type: file.type,
        hostedUrl: payload.data.display_url,
      },
    });

    return NextResponse.json({
      url: payload.data.display_url,
      deleteUrl: payload.data.delete_url,
      id: payload.data.id,
    });
  } catch (error) {
    console.error("POST /api/upload failed", error);
    return NextResponse.json({ error: "Unable to upload image" }, { status: 500 });
  }
}
