"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/app/components/icons";

export type SelectOption = { value: string; label: string };

type SelectMenuProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export function SelectMenu({ id, label, value, options, onChange }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return <div ref={menuRef} className="relative">
    <span id={`${id}-label`} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    <button type="button" id={`${id}-button`} aria-haspopup="listbox" aria-expanded={open} aria-labelledby={`${id}-label ${id}-button`} onClick={() => setOpen((current) => !current)} className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm font-medium text-slate-700 outline-none transition ${open ? "border-blue-500 ring-4 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
      <span>{selectedOption?.label}</span><Icon name="chevronRight" size={16} className={`text-slate-400 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
    </button>
    {open ? <div role="listbox" aria-labelledby={`${id}-label`} className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/60 ring-1 ring-slate-950/5">
      {options.map((option) => { const selected = option.value === value; return <button key={option.value} type="button" role="option" aria-selected={selected} onClick={() => { onChange(option.value); setOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${selected ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}><span>{option.label}</span>{selected ? <Icon name="check" size={16} className="text-blue-600" /> : null}</button>; })}
    </div> : null}
  </div>;
}
