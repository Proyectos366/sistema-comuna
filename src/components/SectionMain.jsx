import Section from "@/components/padres/Section";

export default function SectionMain({ children }) {
  return (
    <Section className="rounded-md p-2 sm:p-6 min-h-screen flex flex-col items-center sm:justify-center gap-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      {children}
    </Section>
  );
}
