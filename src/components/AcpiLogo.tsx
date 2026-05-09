'use client'

type AcpiLogoProps = {
  size?: number
  alt?: string
}

type AcpiBrandProps = {
  size?: number
  textSize?: string
  stacked?: boolean
}

export const ACPI_LOGO_SRC = '/acpi-logo.png.png'
export const ACPI_COLORS = {
  navy: '#061b33',
  cyan: '#39f2f2',
  teal: '#00c9c9',
  violet: '#6b5cff',
  orange: '#ff8a1f',
  white: '#ffffff',
}

export default function AcpiLogo({ size = 38, alt = 'Assam Career Point & Info logo' }: AcpiLogoProps) {
  return (
    <img
      src={ACPI_LOGO_SRC}
      alt={alt}
      style={{
        width: size,
        height: size,
        display: 'block',
        objectFit: 'contain',
        flexShrink: 0,
      }}
    />
  )
}

export function AcpiBrand({ size = 38, textSize = '.86rem', stacked = false }: AcpiBrandProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <AcpiLogo size={size} />
      <span
        style={{
          fontFamily: 'Arial Black, Sora, sans-serif',
          fontWeight: 900,
          fontSize: textSize,
          lineHeight: 1.15,
          letterSpacing: 0,
          color: ACPI_COLORS.white,
        }}
      >
        <span style={{ color: ACPI_COLORS.cyan }}>ASSAM </span>
        <span style={{ color: ACPI_COLORS.white }}>CAREER</span>
        {stacked ? <br /> : ' '}
        <span style={{ color: ACPI_COLORS.teal }}>POINT & INFO</span>
      </span>
    </span>
  )
}
