import { createContext, useContext, useReducer, useEffect } from 'react'

const MOCK_JOBS = [
  { id: 'j1', company: 'Google', role: 'Senior Frontend Engineer', location: 'Bangalore', salary: '₹45 LPA', status: 'interview', appliedDate: '2024-01-15', notes: 'L4 position, 3 rounds done', skills: ['React', 'TypeScript', 'System Design'], matchScore: 91, description: 'Build next-gen web experiences...', logo: 'G' },
  { id: 'j2', company: 'Microsoft', role: 'React Developer', location: 'Hyderabad', salary: '₹38 LPA', status: 'offer', appliedDate: '2024-01-10', notes: 'Offer received, negotiating', skills: ['React', 'Azure', 'TypeScript'], matchScore: 88, description: 'Join the Teams web team...', logo: 'M' },
  { id: 'j3', company: 'Razorpay', role: 'UI Engineer II', location: 'Bangalore', salary: '₹28 LPA', status: 'hr_round', appliedDate: '2024-01-20', notes: 'HR call on Friday', skills: ['React', 'Design Systems'], matchScore: 85, description: 'Build payment UIs...', logo: 'R' },
  { id: 'j4', company: 'CRED', role: 'Frontend Lead', location: 'Bangalore', salary: '₹35 LPA', status: 'assignment', appliedDate: '2024-01-18', notes: 'Assignment due this week', skills: ['React', 'Performance', 'CSS'], matchScore: 82, description: 'Lead frontend guild...', logo: 'C' },
  { id: 'j5', company: 'Swiggy', role: 'Senior SDE UI', location: 'Bangalore', salary: '₹32 LPA', status: 'applied', appliedDate: '2024-01-22', notes: '', skills: ['React', 'Node', 'Redux'], matchScore: 79, description: 'Work on consumer apps...', logo: 'S' },
  { id: 'j6', company: 'Zepto', role: 'Frontend Architect', location: 'Mumbai', salary: '₹40 LPA', status: 'screening', appliedDate: '2024-01-19', notes: 'Screening call done', skills: ['Architecture', 'React', 'Performance'], matchScore: 87, description: 'Architect frontend platform...', logo: 'Z' },
  { id: 'j7', company: 'Zomato', role: 'React Native + Web Dev', location: 'Gurugram', salary: '₹30 LPA', status: 'rejected', appliedDate: '2024-01-05', notes: 'Rejected after round 2', skills: ['React', 'React Native'], matchScore: 72, description: 'Build cross-platform apps...', logo: 'Zo' },
  { id: 'j8', company: 'Meesho', role: 'UI Engineer', location: 'Bangalore', salary: '₹24 LPA', status: 'saved', appliedDate: '2024-01-25', notes: 'Need to apply', skills: ['React', 'CSS', 'Performance'], matchScore: 76, description: 'Social commerce platform...', logo: 'Me' },
  { id: 'j9', company: 'Groww', role: 'Frontend Developer', location: 'Bangalore', salary: '₹26 LPA', status: 'applied', appliedDate: '2024-01-23', notes: '', skills: ['React', 'D3', 'Charts'], matchScore: 80, description: 'Build fintech UI...', logo: 'Gr' },
  { id: 'j10', company: 'PhonePe', role: 'Senior Frontend', location: 'Bangalore', salary: '₹34 LPA', status: 'hired', appliedDate: '2023-12-15', notes: 'Joined on 1st Feb', skills: ['React', 'TypeScript', 'Performance'], matchScore: 92, description: 'Payments platform...', logo: 'P' },
  { id: 'j11', company: 'Flipkart', role: 'SDE2 Frontend', location: 'Bangalore', salary: '₹36 LPA', status: 'screening', appliedDate: '2024-01-21', notes: '', skills: ['React', 'Commerce', 'A/B Testing'], matchScore: 83, description: 'E-commerce platform...', logo: 'F' },
  { id: 'j12', company: 'Ola', role: 'React Developer', location: 'Bangalore', salary: '₹22 LPA', status: 'rejected', appliedDate: '2024-01-02', notes: 'Culture fit mismatch', skills: ['React', 'Maps', 'Realtime'], matchScore: 68, description: 'Build ride-sharing UI...', logo: 'O' },
  { id: 'j13', company: "Byju's", role: 'Frontend Engineer', location: 'Bangalore', salary: '₹20 LPA', status: 'saved', appliedDate: '2024-01-26', notes: 'Low priority', skills: ['React', 'Video', 'EdTech'], matchScore: 65, description: 'EdTech platform...', logo: 'B' },
  { id: 'j14', company: 'Freshworks', role: 'UI Developer', location: 'Chennai', salary: '₹28 LPA', status: 'interview', appliedDate: '2024-01-16', notes: 'Round 1 tomorrow', skills: ['React', 'SaaS', 'Customer Success'], matchScore: 84, description: 'CRM software...', logo: 'Fw' },
  { id: 'j15', company: 'Postman', role: 'Frontend Engineer II', location: 'Bangalore (Remote)', salary: '₹32 LPA', status: 'applied', appliedDate: '2024-01-24', notes: '', skills: ['React', 'API', 'Developer Tools'], matchScore: 89, description: 'API development platform...', logo: 'Pm' },
]

const LS_KEY = 'jf_jobs_v1'

function loadJobs() {
  try {
    const s = localStorage.getItem(LS_KEY)
    return s ? JSON.parse(s) : MOCK_JOBS
  } catch {
    return MOCK_JOBS
  }
}

function saveJobs(jobs) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(jobs))
  } catch {}
}

const initialState = {
  jobs: loadJobs(),
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const jobs = [...state.jobs, action.job]
      saveJobs(jobs)
      return { ...state, jobs }
    }
    case 'UPDATE': {
      const jobs = state.jobs.map(j => j.id === action.job.id ? action.job : j)
      saveJobs(jobs)
      return { ...state, jobs }
    }
    case 'DELETE': {
      const jobs = state.jobs.filter(j => j.id !== action.id)
      saveJobs(jobs)
      return { ...state, jobs }
    }
    case 'MOVE': {
      const jobs = state.jobs.map(j => j.id === action.id ? { ...j, status: action.status } : j)
      saveJobs(jobs)
      return { ...state, jobs }
    }
    case 'SET_SAVED': {
      const jobs = state.jobs.map(j => j.id === action.id ? { ...j, status: 'saved' } : j)
      saveJobs(jobs)
      return { ...state, jobs }
    }
    case 'RESET': {
      saveJobs(MOCK_JOBS)
      return { jobs: MOCK_JOBS }
    }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch, jobs: state.jobs }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
