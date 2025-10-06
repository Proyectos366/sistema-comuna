import Switch from "react-switch";
import Div from "@/components/padres/Div";

export default function SwitchToggle({ checked, onToggle }) {
  return (
    <Div>
      <Switch onChange={onToggle} checked={checked} />
    </Div>
  );
}
