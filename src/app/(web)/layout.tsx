import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";

export default function WebLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
