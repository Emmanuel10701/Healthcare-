import Wrapper from "./wrapper/page";
import ClientLayout from "./_app";
import './globals.css'; // Adjust the path as needed

export const metadata = {
  title: "Appointments",
  description: "Doctors Appointment",
};

export default function RootLayout({ children }) {
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
