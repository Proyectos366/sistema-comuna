export default function SectionRegistroMostrar({ children }) {
  return (
    <section className="rounded-md p-2 sm:p-6 min-h-screen flex flex-col items-center sm:justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      {children}
    </section>
  );
}
