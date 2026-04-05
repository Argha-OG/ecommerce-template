import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const q = searchParams.get("q") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const skip = (page - 1) * limit;

    // Search filter
    let query = {};
    if (q) {
      query = {
        $or: [
          { customerName: { $regex: q, $options: "i" } },
          { customerEmail: { $regex: q, $options: "i" } },
          { whatsappReference: { $regex: q, $options: "i" } }
        ]
      };
    }

    // Sort definition
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const [orders, totalCount] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);

    return NextResponse.json({
      data: orders,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      currentPage: page
    });
  } catch (error) {
    console.error("Admin Orders API Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}


