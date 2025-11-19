import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";

export default function LeyendaUsuarios() {
  return (
    <Div className="w-full bg-gray-100 backdrop-blur-md rounded-md shadow-xl mb-4 p-4 border border-gray-300">
      <Div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[
          { color: "#082158", label: "Administradores" },
          { color: "#2FA807", label: "Directores" },
          { color: "#A62A69", label: "Obreros" },
          { color: "#E61C45", label: "Inhabilitados" },
        ].map((item, index) => (
          <Div
            key={item.label}
            className="flex flex-col items-center gap-2 fade-in-up"
            style={{
              animationDelay: `${index * 0.3}s`,
            }}
          >
            <Div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: item.color }}
            ></Div>
            <Span className="font-medium">{item.label}</Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}
