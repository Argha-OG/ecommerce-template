import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Total Sales
    const orders = await Order.find({ status: "Completed" });
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 2. Active Orders (Pending or Processing)
    const activeOrdersCount = await Order.countDocuments({ 
      status: { $in: ["Pending", "Processing"] } 
    });

    // 3. Total Clients
    const totalClientsCount = await Customer.countDocuments();

    // 4. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      totalSales,
      activeOrdersCount,
      totalClientsCount,
      recentOrders
    });
  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
