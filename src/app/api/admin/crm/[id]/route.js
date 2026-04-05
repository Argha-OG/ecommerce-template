import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function PATCH(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error("Customer Update API Error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer Delete API Error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
