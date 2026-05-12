import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/features/catalog/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ products: [], count: 0 });
  }

  const { products, count } = await getProducts({ search: query, limit: 24 });

  return NextResponse.json({ products, count });
}