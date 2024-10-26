import type { Metadata } from "next";
import Wrapper from "../app/wrapper/page"
import ClientLayout from "../app/_app";
import './globals.css'; // Adjust the path as needed

export const metadata: Metadata = {
  title: "Appointments",
  description: "Doctors Appointment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
   <body className="bg-gray-100">
      <Wrapper>
      <ClientLayout>{children}</ClientLayout>
      </Wrapper>
      </body>
    </html>
  );
}
