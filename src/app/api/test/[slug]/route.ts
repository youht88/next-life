import {NextResponse, NextRequest} from "next/server"
export async function GET(req: NextRequest,
    { params }: { params: { slug: string } }
){
    const cookies = req.cookies
    const headers = new Headers(req.headers)
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('query')
    // query is "hello" for /api/search?query=hello
    //const body = await req.json()
    // return new NextResponse("helloworld1",{status:200})
    return NextResponse.json({
        "query":query,
        "headers":headers,
        "cookies":cookies??"none",
        "slug":params.slug,
        //"body":body
    })
}
