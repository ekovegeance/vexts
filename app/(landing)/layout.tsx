import {NavBar} from "@/components/nav/nav-bar";
import {ReactNode} from "react";
import Footer from "@/components/footer";

export default function DashboardLayout({children,}: { children: ReactNode }) {
    return (
        <main>
            <NavBar/>
            <section className="container mx-auto px-4 py-8">
            {children}
            </section>
            <Footer/>
        </main>
    )
}