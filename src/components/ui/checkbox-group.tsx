import { cn } from "@/lib/utils";

type CheckboxGroupProps = {
  name: string;
  options: string[];
  defaultSelected?: string[];
  label?: string;
};

/**
 * A tag picker that actually submits.
 *
 * The previous TagSelect kept its selection in local React state with no
 * `name`, so nothing it selected ever reached the server. This uses real
 * checkboxes styled with `peer-checked`, so it needs no client JavaScript and
 * posts every selected value under the same field name.
 */
export function CheckboxGroup({
  name,
  options,
  defaultSelected = [],
  label,
}: CheckboxGroupProps) {
  return (
    <fieldset className="space-y-3">
      {label ? (
        <legend className="text-sm text-[var(--muted-foreground)]">{label}</legend>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={defaultSelected.includes(option)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex rounded-full border px-3 py-2 text-sm transition",
                "border-white/10 bg-white/5 text-[var(--muted-foreground)]",
                "hover:border-white/20 hover:text-white",
                "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]/15 peer-checked:text-white",
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
