type SwitchProps = {
  checked?: boolean;
};

export function Switch({ checked = false }: SwitchProps) {
  return (
    <div
      className={`relative h-7 w-12 rounded-full border transition ${
        checked
          ? "border-[var(--accent)] bg-[var(--accent)]"
          : "border-white/10 bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </div>
  );
}
