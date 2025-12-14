import { Navbar } from "@/components/sentinel/Navbar";
import { Outlet } from "react-router";

export function Root() {
  return (
    <>
      <main className="w-full h-screen flex">
        <Navbar />

        <section className="flex-1 min-h-0 h-screen flex flex-col w-full p-4 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </>
  );
}
