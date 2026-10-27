import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className="ui-button" {...props} />; }
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input className="ui-input" {...props} />; }
export function FormField({ label, children }: { label: string; children: ReactNode }) { return <label className="ui-field"><span>{label}</span>{children}</label>; }
export function Alert({ children }: { children: ReactNode }) { return <div className="ui-alert" role="alert">{children}</div>; }
export function LoadingState() { return <span role="status" aria-live="polite">Carregando…</span>; }
