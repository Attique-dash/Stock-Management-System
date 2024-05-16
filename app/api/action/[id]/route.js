import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request, content) {
  
  const uri = "mongodb+srv://attiqueshafeeq123:GC3jZaBbkAVjyUiK@stock-management-system.4jqares.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();

    const database = client.db('stock');
    const inventory = database.collection('inventory');
    
    const productId = content.params.id;
    const record = { _id: new ObjectId(productId) };
    
    const result = await inventory.deleteOne(record);

    if (result.deletedCount === 0) {
      return new NextResponse("Object not found", { status: 404 });
    }

    return new NextResponse("Object deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting object:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await client.close();
  }
};

export async function PUT(request,content) {

  const uri = "mongodb+srv://attiqueshafeeq123:GC3jZaBbkAVjyUiK@stock-management-system.4jqares.mongodb.net/";
  const client = new MongoClient(uri);
  
  
  try {
    await client.connect();

    const database = client.db('stock');
    const inventory = database.collection('inventory');

    let updatedProduct = await request.json();
    const productId = content.params.id;

    console.log("productId-> ",productId);
    console.log(" updatedProduct-> ",updatedProduct)
    
    const result = await inventory.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct },
    );
 
    console.log("result-> ",result)

    if (result) {
      return new NextResponse('Product updated successfully', { status: 200,result:result.value });
    } else {
    return new NextResponse("Product not found", { status: 500 });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return new NextResponse('Failed to update product', { status: 500,error: error.message });

  } finally {
    await client.close();
  }
}