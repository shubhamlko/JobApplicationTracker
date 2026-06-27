import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'

export function useJobs() {
  const { jobs } = useAppContext()

  const computed = useMemo(() => {
    const totalApplied = jobs.filter(j => j.status !== 'saved').length
    const activeCount = jobs.filter(j => !['rejected', 'saved'].includes(j.status)).length
    const interviewCount = jobs.filter(j => ['interview', 'hr_round'].includes(j.status)).length
    const offerCount = jobs.filter(j => ['offer', 'hired'].includes(j.status)).length
    const rejectedCount = jobs.filter(j => j.status === 'rejected').length
    const hiredCount = jobs.filter(j => j.status === 'hired').length
    const appliedCount = jobs.filter(j => j.status !== 'saved').length
    const responseRate = appliedCount > 0
      ? Math.round(((interviewCount + offerCount + hiredCount) / appliedCount) * 100)
      : 0

    return {
      totalApplied,
      activeCount,
      interviewCount,
      offerCount,
      rejectedCount,
      hiredCount,
      responseRate,
      jobs,
    }
  }, [jobs])

  return computed
}
