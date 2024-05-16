import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

  const uri = "mongodb+srv://attiqueshafeeq123:GC3jZaBbkAVjyUiK@stock-management-system.4jqares.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query = {};
    const products = await inventory.find(query).toArray();
    return NextResponse.json({ success: true, products })
  } finally {
    await client.close();
  }
}

export async function POST(request) {

  let body = await request.json();
  console.log(body);


  const uri = "mongodb+srv://attiqueshafeeq123:GC3jZaBbkAVjyUiK@stock-management-system.4jqares.mongodb.net/";
  const client = new MongoClient(uri);

  try {


    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const product = await inventory.insertOne(body)
    console.log("i am here after product ", product)
    return NextResponse.json({ product, ok: true })
  } catch (error) {
    console.log("i am here erro", error)
    return NextResponse.json({ error, ok: false })
  } finally {
    console.log("finally")
    await client.close();
    return NextResponse.json("DB closed")
  }

};
