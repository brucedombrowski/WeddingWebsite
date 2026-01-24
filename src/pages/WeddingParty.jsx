import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteSettings } from '../firebase/useSiteSettings'

function OneManWolfPack() {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/images/one-man-wolf-pack.gif"
        alt="One Man Wolf Pack"
        className="w-64 h-auto rounded-xl shadow-lg"
      />
    </div>
  )
}

function WeddingPartyCard({ name, role, subRole, description, image, emoji, isHonor, delay = 0 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative bg-white rounded-3xl overflow-hidden shadow-xl border-2 transition-all duration-500 ${
          isHonor
            ? 'border-primary-300 shadow-primary-100'
            : 'border-accent-100'
        } ${isHovered ? 'shadow-2xl scale-105 -translate-y-2' : ''}`}
      >
        {/* Honor badge */}
        {isHonor && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {role.includes('Best') ? 'BEST MAN' : 'HONOR'}
          </div>
        )}

        {/* Image/Emoji section */}
        <div className="relative h-64 overflow-hidden">
          {image ? (
            <>
              <img
                src={image}
                alt={name}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </>
          ) : (
            <div className="h-full bg-gradient-to-br from-accent-100 via-primary-50 to-accent-100 flex items-center justify-center">
              {emoji ? (
                <span
                  className={`text-8xl transition-transform duration-500 ${
                    isHovered ? 'scale-125 rotate-12' : ''
                  }`}
                >
                  {emoji}
                </span>
              ) : (
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center transition-transform duration-500 ${
                    isHovered ? 'scale-110' : ''
                  }`}
                >
                  <span className="text-3xl font-medium text-accent-700">
                    {name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Decorative corner */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" style={{
            clipPath: 'ellipse(60% 100% at 50% 100%)'
          }} />
        </div>

        {/* Content */}
        <div className="p-6 text-center -mt-4 relative">
          <h4 className="text-2xl text-accent-800 mb-1 font-medium">{name}</h4>
          <div className="mb-3">
            <p className={`text-sm font-semibold ${
              isHonor ? 'text-primary-600' : 'text-accent-500'
            }`}>
              {role}
            </p>
            {subRole && (
              <p className="text-[10px] text-accent-400 mt-0.5">{subRole}</p>
            )}
          </div>
          {description && (
            <p className={`text-accent-600 text-sm transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-70'
            }`}>
              {description}
            </p>
          )}
        </div>

        {/* Bottom accent line */}
        <div className={`h-1 transition-all duration-500 ${
          isHonor
            ? 'bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400'
            : 'bg-gradient-to-r from-accent-200 via-accent-300 to-accent-200'
        }`} />
      </div>
    </div>
  )
}

function SectionDivider({ side }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <div className={`h-px w-24 md:w-48 ${
        side === 'bride'
          ? 'bg-gradient-to-r from-transparent to-primary-300'
          : 'bg-gradient-to-r from-transparent to-accent-300'
      }`} />
      <div className={`w-3 h-3 rotate-45 ${
        side === 'bride' ? 'bg-primary-400' : 'bg-accent-400'
      }`} />
      <div className={`h-px w-24 md:w-48 ${
        side === 'bride'
          ? 'bg-gradient-to-l from-transparent to-primary-300'
          : 'bg-gradient-to-l from-transparent to-accent-300'
      }`} />
    </div>
  )
}

function WeddingParty({ raveMode }) {
  const navigate = useNavigate()
  const { settings, loading } = useSiteSettings()

  // Easter egg: Party mode on Wedding Party page goes to Father of Bride
  useEffect(() => {
    if (raveMode) {
      navigate('/father-of-bride')
    }
  }, [raveMode, navigate])

  // Default data (fallback if not in Firestore)
  const defaultParty = {
    bridesmaids: [
      { id: '1', name: "Leah Brannon", role: "Maid of Honor", bio: "", isHonor: true },
      { id: '2', name: "Ana Salas", role: "Bridesmaid", bio: "" },
      { id: '3', name: "Tracy", role: "Bridesmaid", bio: "" },
      { id: '4', name: "Lyndsay Cormier", role: "Bridesmaid", bio: "" },
      { id: '5', name: "Riley Brannon", role: "Junior Bridesmaid", bio: "Niece of Hilary" },
      { id: '6', name: "Amelie Dombrowski", role: "Junior Bridesmaid", bio: "Bruce's daughter" },
      { id: '7', name: "Avery Brannon", role: "Flower Girl", bio: "Niece of Hilary" },
    ],
    groomsmen: [
      { id: '8', name: "Francis Lake", role: "Ring Bearer", bio: "" },
    ]
  }

  // Use Firestore data if available, otherwise use defaults
  const partyData = settings.weddingParty || defaultParty
  const allBridesmaids = partyData.bridesmaids || defaultParty.bridesmaids
  const allGroomsmen = partyData.groomsmen || defaultParty.groomsmen

  // Separate by role for display
  const maidOfHonor = allBridesmaids.find(m =>
    m.role?.toLowerCase().includes('maid of honor') ||
    m.role?.toLowerCase().includes('matron of honor')
  ) || { name: "Leah Brannon", role: "Maid* of Honor", subRole: "(Matron)", isHonor: true }

  const bridesmaids = allBridesmaids.filter(m =>
    m.role?.toLowerCase() === 'bridesmaid'
  )

  const juniorBridesmaids = allBridesmaids.filter(m =>
    m.role?.toLowerCase().includes('junior')
  )

  const flowerGirls = allBridesmaids.filter(m =>
    m.role?.toLowerCase().includes('flower')
  )

  const ringBearer = allGroomsmen.find(m =>
    m.role?.toLowerCase().includes('ring bearer')
  ) || { name: "Francis Lake", role: "Ring Bearer" }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-50 via-white to-primary-50" />

      
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-primary-50 rounded-full blur-3xl opacity-40" />

      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl text-accent-800 mb-6 epic-entrance tracking-wide">
              The Wedding Party
            </h1>
            <p className="text-accent-600 text-xl max-w-2xl mx-auto leading-relaxed">
              The incredible people who have supported our journey and will stand with us
              as we say "I do"
            </p>
          </div>

          {/* Maid of Honor */}
          <section className="mb-12">
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <WeddingPartyCard
                  name={maidOfHonor.name}
                  role={maidOfHonor.role}
                  subRole={maidOfHonor.role?.toLowerCase().includes('matron') ? '(Matron)' : ''}
                  description={maidOfHonor.bio}
                  image={maidOfHonor.photo}
                  isHonor={true}
                  delay={0}
                />
              </div>
            </div>
          </section>

          {/* Connecting line */}
          <div className="flex justify-center mb-12">
            <div className="w-px h-12 bg-gradient-to-b from-primary-200 to-accent-200"></div>
          </div>

          {/* Bridesmaids */}
          {bridesmaids.length > 0 && (
            <section className="mb-12">
              <div className={`grid grid-cols-1 ${bridesmaids.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-6 max-w-4xl mx-auto`}>
                {bridesmaids.map((person, index) => (
                  <WeddingPartyCard
                    key={person.id || index}
                    name={person.name}
                    role={person.role}
                    description={person.bio}
                    image={person.photo}
                    delay={index + 2}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Bruce's Side - The Rooster */}
          <section className="mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto border border-accent-100">
              <h3 className="text-center text-xl text-accent-600 mb-4">Bruce's Crew</h3>
              <OneManWolfPack />
            </div>
          </section>

          {/* Connecting line */}
          <div className="flex justify-center mb-12">
            <div className="w-px h-12 bg-gradient-to-b from-accent-200 to-primary-100"></div>
          </div>

          {/* Junior Bridesmaids */}
          {juniorBridesmaids.length > 0 && (
            <section className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                {juniorBridesmaids.map((person, index) => (
                  <WeddingPartyCard
                    key={person.id || index}
                    name={person.name}
                    role={person.role}
                    description={person.bio}
                    image={person.photo}
                    delay={index + 5}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Connecting line */}
          <div className="flex justify-center mb-12">
            <div className="w-px h-12 bg-gradient-to-b from-primary-100 to-accent-100"></div>
          </div>

          {/* Flower Girl & Ring Bearer */}
          {(flowerGirls.length > 0 || ringBearer) && (
            <section className="mb-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                {flowerGirls.map((person, index) => (
                  <WeddingPartyCard
                    key={person.id || index}
                    name={person.name}
                    role={person.role}
                    description={person.bio}
                    image={person.photo}
                    delay={7}
                  />
                ))}
                {ringBearer && (
                  <WeddingPartyCard
                    name={ringBearer.name}
                    role={ringBearer.role}
                    description={ringBearer.bio}
                    image={ringBearer.photo}
                    delay={8}
                  />
                )}
              </div>
            </section>
          )}

          {/* Thank You Message */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 via-white to-accent-100/50 rounded-3xl blur-xl" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 md:p-16 shadow-2xl border border-accent-100 text-center">
                            <h3 className="text-3xl md:text-4xl text-accent-800 mb-6">
                From the Bottom of Our Hearts
              </h3>
              <p className="text-accent-600 text-lg max-w-2xl mx-auto leading-relaxed">
                We are beyond grateful to have such wonderful people in our lives.
                Your love, support, and friendship mean everything to us.
                Thank you for being part of our story and standing with us on our wedding day.
              </p>
              <div className="mt-10">
                <a
                  href="/rsvp"
                  className="inline-block bg-gradient-to-r from-primary-600 to-accent-600 text-white px-10 py-4 rounded-full font-medium tracking-wider uppercase text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                >
                  RSVP to Celebrate With Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}

export default WeddingParty
