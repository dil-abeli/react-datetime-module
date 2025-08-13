export const USER_DATE_FORMATS = [
  'yyyy/MM/dd',
  'MM/dd/yyyy',
  'dd/MM/yyyy',
] as const

export type UserDateFormat = typeof USER_DATE_FORMATS[number]

export const USER_TIME_FORMATS = ['12h', '24h'] as const
export type UserTimeFormat = typeof USER_TIME_FORMATS[number]

export const TIME_FORMAT_PATTERN: Record<UserTimeFormat, string> = {
  '12h': 'hh:mm a',
  '24h': 'HH:mm',
}

export function isUserDateFormat(value: string): value is UserDateFormat {
  return (USER_DATE_FORMATS as readonly string[]).includes(value)
}

export function isUserTimeFormat(value: string): value is UserTimeFormat {
  return (USER_TIME_FORMATS as readonly string[]).includes(value)
}


