"use client";

interface SecNumProps {
  number: string;    /* ex: "02" */
  label: string;     /* ex: "O que está sendo perdido agora" */
}

/**
 * SecNum — numeração de seção com label descritivo.
 *
 * Posicionamento: sempre à direita do SectionTitle dentro de um
 * flex container com justify-content: space-between.
 *
 * Uso:
 *   <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
 *     <SectionTitle title="Título" align="left" />
 *     <SecNum number="02" label="Descrição da seção" />
 *   </div>
 */
export default function SecNum({ number, label }: SecNumProps) {
  return (
    <div
      style={{
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontSize: "var(--text-body-sm)",
        color: "var(--color-text-muted)",
        letterSpacing: "var(--tracking-wide)",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <b
        style={{
          fontStyle: "normal",
          fontWeight: "var(--weight-medium)" as unknown as number,
          color: "var(--color-gold)",
          marginRight: 4,
        }}
      >
        {number}
      </b>
      {label}
    </div>
  );
}

