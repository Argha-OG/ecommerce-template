import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Order Update API Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order Delete API Error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
