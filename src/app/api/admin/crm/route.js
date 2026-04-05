import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const q = searchParams.get("q") || "";
    const sortBy = searchParams.get("sortBy") || "totalLifetimeValue";
    const order = searchParams.get("order") || "desc";
    const skip = (page - 1) * limit;

    // Search filter
    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } }
        ]
      };
    }

    // Sort definition
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sort.totalLifetimeValue = -1;
    }

    const [customers, totalCount] = await Promise.all([
      Customer.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Customer.countDocuments(query)
    ]);

    return NextResponse.json({
      data: customers,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      currentPage: page
    });
  } catch (error) {
    console.error("Admin CRM API Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}


