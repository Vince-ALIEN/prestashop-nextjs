// app/api/prestashop/products/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const psUri = process.env.PRESTASHOP_URI;
  const apiKey = process.env.PRESTASHOP_API_KEY;

  if (!psUri || !apiKey) {
    return NextResponse.json(
      { error: "Configuration manquante" },
      { status: 500 }
    );
  }

  // ✅ Construire l'URL PrestaShop avec les paramètres existants
  const prestashopUrl = `${psUri}/api/products?${searchParams.toString()}&ws_key=${apiKey}`;
  console.log("URL PrestaShop :", prestashopUrl);

  try {
    const response = await fetch(prestashopUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur PrestaShop" },
        { status: response.status }
      );
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
