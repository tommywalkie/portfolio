import { DateTime } from 'luxon'
import pluralize from 'pluralize'

export function formatDateRange(startDate: string, endDate: string | null) {
  const start = DateTime.fromFormat(startDate, 'yyyy-MM')
  const end = endDate ? DateTime.fromFormat(endDate, 'yyyy-MM') : DateTime.now()

  // Calculate duration without the +1 month first
  const baseDuration = end.diff(start, ['years', 'months']).toObject()

  // Special case: if start and end are in the same month of different years
  // (like Sep 2017 to Sep 2019), don't add the extra month
  const sameMonth = start.month === end.month
  const duration = sameMonth ? baseDuration : end.diff(start, ['years', 'months']).plus({ months: 1 }).toObject()

  const formattedStartDate = start.toFormat('MMM yyyy')
  const formattedEndDate = endDate ? DateTime.fromFormat(endDate, 'yyyy-MM').toFormat('MMM yyyy') : 'Present'

  const years = Math.floor(duration.years || 0)
  const months = Math.ceil(duration.months || 0)

  const durationStr =
    years > 0
      ? months > 0
        ? `${years} ${pluralize('year', years)} and ${months} ${pluralize('month', months)}`
        : `${years} ${pluralize('year', years)}`
      : `${months} ${pluralize('month', months)}`

  return {
    formattedStartDate,
    formattedEndDate,
    durationStr,
  }
}

export function formatSchoolDateRange(startDate: string, endDate: string | null) {
  const start = DateTime.fromFormat(startDate, 'yyyy-MM')
  const end = endDate ? DateTime.fromFormat(endDate, 'yyyy-MM') : DateTime.now()

  if (start.month === end.month) {
    return {
      formattedStartDate: `${start.year}`,
      formattedEndDate: `${end.year}`,
    }
  }
  return {
    formattedStartDate: `${start.month} ${start.year}`,
    formattedEndDate: `${end.month} ${end.year}`,
  }
}
