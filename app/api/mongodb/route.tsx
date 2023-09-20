import {ObjectId} from 'mongodb'
import {NextResponse} from 'next/server'
import {NextRequest} from 'next/server'
import {connectToDatabase} from '@/lib/mongo-db-server'


export const GET = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    console.log('mongodb#route#GET: id: ', id)
    const {db} = await connectToDatabase()
    let res = {}

    if (id) {
      res = await db.collection('main').findOne({_id: new ObjectId(id)})
    } else {
      res = await db.collection('main').find({}).toArray()
    }

    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json({
      message: new Error(error).message,
      success: false,
    })
  }
}


export const POST = async (request: Request) => {
  try {
    const postData = (await request.json()).data
    const id = postData._id
    console.log('mongodb#route#PUT: id: ', id)
    const {db} = await connectToDatabase()
    let res = {}

    if (id) {
      res = await db.collection('main').updateOne({_id: new ObjectId(id)}, {$set: postData})
    } else {
      res = await db.collection('main').insertOne(postData)
    }

    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json({
      message: new Error(error).message,
      success: false,
    })
  }
}


export const DELETE = async (request: NextRequest) => {
  try {
    const id = request.nextUrl.searchParams.get('id')
    console.log('mongodb#route#DELETE: id: ', id)

    if (!id) {
      return
    }

    const {db} = await connectToDatabase()
    const res = await db.collection('main').deleteOne({_id: new ObjectId(id)})
    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json({
      message: new Error(error).message,
      success: false,
    })
  }
}
