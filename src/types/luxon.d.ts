declare module 'luxon' {
  export class DateTime {
    static fromISO(iso: string, opts?: { zone?: string }): DateTime
    static fromFormat(text: string, format: string, opts?: { zone?: string }): DateTime
    isValid: boolean
    toUTC(): DateTime
    toISO(opts?: { suppressMilliseconds?: boolean }): string | null
    toFormat(fmt: string): string
    setZone(zone: string): DateTime
  }
}


