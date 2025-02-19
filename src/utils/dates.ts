import { DateTime } from 'luxon'
import pluralize from 'pluralize'

export function formatDateRange(startDate: string, endDate: string | null) {
  const start = DateTime.fromFormat(startDate, 'yyyy-MM')
  const end = endDate ? DateTime.fromFormat(endDate, 'yyyy-MM') : DateTime.now()

  // Add 1 month to include both start and end months in the duration
  const duration = end.diff(start, ['years', 'months']).plus({ months: 1 }).toObject()

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
