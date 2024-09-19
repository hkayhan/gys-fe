import {NextResponse} from "next/server";
import {verifyJwtToken} from "@/libs/auth";

const AUTH_PAGES = ["/login", "/register"];
// const AUTH_PAGES = [];

const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request) {
    const {url, nextUrl, cookies} = request;
    const {value: token} = cookies.get("token") ?? {value: null};
    console.log("token ", token)

    const hasVerifiedToken = token && (await verifyJwtToken(token));

    const isAuthPageRequested = isAuthPages(nextUrl.pathname);

    if (isAuthPageRequested) {
        console.log("burada 5   ");
        if (!hasVerifiedToken || hasVerifiedToken.errorMessage!==null) {
            const response = NextResponse.next();
            console.log("token sil part 1");
            response.cookies.delete("token2");
            return response;
        }

        return NextResponse.redirect(new URL(`/`, url));
    }

    if (!hasVerifiedToken) {
        const searchParams = new URLSearchParams(nextUrl.searchParams);
        searchParams.set("next", nextUrl.pathname);

        const response = NextResponse.redirect(new URL(`/login?${searchParams}`, url));
        console.log("token sil part 2");
        response.cookies.delete("token2");

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher:
        [
            "/login",
            "/myProfile",
            "/editCompanyProfile",
            "/panel/:path*",
            "/advert/:path*",
            "/admin/:path*"
        ]};