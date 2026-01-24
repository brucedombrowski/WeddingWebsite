import configData from '../config.json'

export const config = configData

export const getCoupleName = () => {
  const { bride, groom } = config.wedding
  return `${bride.firstName} & ${groom.firstName}`
}

export const getFullCoupleName = () => {
  const { bride, groom } = config.wedding
  return `${bride.firstName} ${bride.lastName} & ${groom.firstName} ${groom.lastName}`
}

export const getWeddingDate = () => {
  // Parse as local date to avoid timezone issues
  const [year, month, day] = config.wedding.date.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default config
