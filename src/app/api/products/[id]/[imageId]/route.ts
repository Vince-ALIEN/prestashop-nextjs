// app/api/images/products/[id]/[imageId]/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Route API Next.js pour proxyer les images PrestaShop
 * Avantages :
 * - Clé API non exposée côté client
 * - Meilleur caching
 * - Plus sécurisé
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  // ✅ Next.js 16 : params est une Promise
  const { id, imageId } = await params;

  // Utiliser les variables d'environnement SERVEUR (sécurisées)
  const psUri = process.env.PRESTASHOP_URI;
  const apiKey = process.env.PRESTASHOP_API_KEY;

  if (!psUri || !apiKey) {
    return NextResponse.json(
      { error: "Configuration PrestaShop manquante" },
      { status: 500 }
    );
  }

  // Construire l'URL PrestaShop
  const imageUrl = `${psUri}/api/images/products/${id}/${imageId}?ws_key=${apiKey}`;

  try {
    // Récupérer l'image depuis PrestaShop
    const response = await fetch(imageUrl, {
      // Cache pendant 1 heure
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Image non trouvée : ${imageUrl}`);
      return NextResponse.json(
        { error: "Image non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer l'image en tant que buffer
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // Déterminer le type de contenu
    const contentType = response.headers.get("Content-Type") || "image/jpeg";

    // Retourner l'image avec les bons headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache très agressif (1 an) car les images changent rarement
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erreur chargement image PrestaShop:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du chargement de l'image" },
      { status: 500 }
    );
  }
}