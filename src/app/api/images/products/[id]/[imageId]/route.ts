// app/api/images/products/[id]/[imageId]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;
  const psUri = process.env.PRESTASHOP_URI;
  const apiKey = process.env.PRESTASHOP_API_KEY;

  if (!psUri || !apiKey) {
    console.error("Configuration PrestaShop manquante");
    return NextResponse.json(
      { error: "Configuration manquante" },
      { status: 500 }
    );
  }

  // Construire l'URL PrestaShop pour récupérer l'image
  const prestashopUrl = `${psUri}/api/images/products/${id}/${imageId}?ws_key=${apiKey}`;
  console.log("Requête image PrestaShop:", prestashopUrl);

  try {
    const response = await fetch(prestashopUrl, {
      next: { revalidate: 3600 }, // Cache 1 heure
    });

    if (!response.ok) {
      console.error(`Image non trouvée: ${prestashopUrl} (${response.status})`);
      return NextResponse.json(
        { error: "Image non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer l'image en tant que buffer
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("Content-Type") || "image/jpeg";

    // Retourner l'image avec les bons headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'image:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
