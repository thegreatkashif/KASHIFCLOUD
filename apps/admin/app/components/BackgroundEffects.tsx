"use client";

export function BackgroundEffects() {

return (

<div
className="pointer-events-none fixed inset-0 overflow-hidden"
>

<div
style={{
position:"absolute",
inset:0,
background:
"radial-gradient(circle at 50% 0%, rgba(184,32,47,.08), transparent 45%), radial-gradient(circle at 100% 100%, rgba(106,53,168,.08), transparent 40%)"
}}
/>

<div
style={{
position:"absolute",
inset:0,
backgroundImage:
"linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
backgroundSize:"40px 40px",
opacity:.25
}}
/>

</div>

);

}
