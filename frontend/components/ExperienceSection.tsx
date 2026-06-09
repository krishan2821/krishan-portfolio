// ExperienceSection — futuristic timeline of work experience, education history, and interactive certifications zoom lightbox
'use client'

import { useState, useCallback, memo } from 'react'
import Image from 'next/image'
import {
  IconAward,
  IconBriefcase,
  IconSchool,
  IconCertificate,
  IconZoomIn,
  IconX,
  IconCalendar,
  IconMapPin,
} from '@tabler/icons-react'

interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string[]
  skills?: string[]
}

interface EducationItem {
  degree: string
  school: string
  period: string
  details: string
}

interface CertificateItem {
  title: string
  issuer: string
  date: string
  imageSrc: string
  description: string
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    role: 'Data Science & Machine Learning Intern',
    company: 'HDLC Technologies',
    period: '06/2024',
    description: [
      'Data Analysis & Modeling: Successfully completed an intensive program focusing on Data Science methodologies and Machine Learning algorithms.',
      'Worked with high commitment to develop and deliver a technical project, ensuring data accuracy and model efficiency.',
      'Applied statistical techniques to analyze datasets, identifying key patterns and insights to drive data-driven decision-making & Gained hands-on experience in building and validating machine learning models to solve real-world problems.'
    ],
    skills: ['Data Science', 'Machine Learning', 'Python', 'Data Analysis', 'ML Modeling']
  },
  {
    role: 'Red Hat Certified System Administrator (RHCSA)',
    company: 'RHEL Environment',
    period: '08/2023',
    description: [
      'RHCSA Curriculum Focused: Gained hands-on experience in Red Hat Enterprise Linux (RHEL) environment, focusing on system administration, configuration, and management.',
      'Performed essential tasks including user and group management, permissions handling, and configuring local storage using LVM & Configured firewall settings (firewalld) and managed SELinux policies to maintain a secure server environment.'
    ],
    skills: ['Linux', 'RHCSA', 'RHEL', 'SELinux', 'LVM', 'Firewalld']
  },
  {
    role: 'Cyber Security Intern',
    company: 'Cyberops Infosec LLP',
    period: '05/2024 - 09/2024',
    description: [
      'Completed a comprehensive 4-month Cyber Security Internship (Ref. No: JPCO/HR/2024-055).',
      'Acquired hands-on experience in vulnerability assessment, information security protocols, and security audits under expert supervision.',
      'Recognized for being punctual, hardworking, and highly inquisitive by the executive leadership (Mr. Mukesh Choudhary, CEO).'
    ],
    skills: ['Cyber Security', 'Infosec', 'Vulnerability Assessment', 'Network Security', 'Security Audits']
  },
  {
    role: 'Web Designing Intern',
    company: 'Centre For Electronic Governance',
    period: '07/2021 - 08/2021',
    description: [
      'Received specialized hands-on training in crafting dynamic and visually appealing web systems.',
      'Acquired proficiency in frontend structures using semantic HTML, vanilla CSS layout techniques, and JavaScript interactions.'
    ],
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Web Designing']
  }
]

const EDUCATION_DATA: EducationItem[] = [
  {
    degree: 'Bachelors of Technology (CSE)',
    school: 'Jodhpur Institute of Engineering and Technology',
    period: 'Graduated: 2025',
    details: 'CGPA: 7.70 / 10. Focused on Computer Science, Software Architecture, Database Management, and Agentic Workflows.'
  },
  {
    degree: 'Engineering (Diploma - CSE)',
    school: 'Govt. R.C. Khetan Polytechnic College Jaipur',
    period: 'Graduated: 2022',
    details: 'Percentage: 70%. Core grounding in Operating Systems, SQL databases, and fundamental Object-Oriented Programming.'
  }
]

const CERTIFICATES_DATA: CertificateItem[] = [
  {
    title: 'Red Hat Certified System Administrator (RHCSA)',
    issuer: 'Red Hat',
    date: 'August 2023',
    imageSrc: '/images/cert_1.jpg',
    description: 'Credential proving hands-on command-line expertise in Red Hat Enterprise Linux system configuration, administration, and network security.'
  },
  {
    title: 'Web Designing Certification',
    issuer: 'Centre For Electronic Governance (CEG)',
    date: 'August 2021',
    imageSrc: '/images/cert_2.jpg',
    description: 'Completion certificate recognizing competency in frontend development foundations using HTML, CSS, and JavaScript.'
  }
]

export const ExperienceSection = memo(function ExperienceSection() {
  const [activeCert, setActiveCert] = useState<string | null>(null)

  const openLightbox = useCallback((src: string) => {
    setActiveCert(src)
  }, [])

  const closeLightbox = useCallback(() => {
    setActiveCert(null)
  }, [])

  return (
    <section id="experience" className="section-container" aria-label="Experience and education credentials">
      
      {/* Lightbox zoom modal */}
      {activeCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Certificate Preview Lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white rounded-full p-2 bg-white/5 transition-colors z-50"
            aria-label="Close Preview"
          >
            <IconX size={24} />
          </button>
          
          <div 
            className="relative w-full max-w-4xl h-[75vh] transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeCert}
              alt="Zoomed certificate credentials"
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        
        {/* Left Side: Experience timeline (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-mono">
              <IconBriefcase size={14} /> Career & Development Timeline
            </div>
            <h2 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 md:text-4xl lg:text-5xl">
              Professional Journey
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 font-medium">
              A chronological history of my technical training, security internships, and backend engineering workflows.
            </p>
          </div>

          <div className="relative border-l border-white/10 pl-6 ml-3 flex flex-col gap-10">
            {EXPERIENCE_DATA.map((exp, idx) => (
              <div key={idx} className="relative group/timeline">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black border-2 border-white/20 transition-all duration-300 group-hover/timeline:border-accent group-hover/timeline:scale-110">
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-600 transition-colors duration-300 group-hover/timeline:bg-accent" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <IconCalendar size={12} className="text-accent" /> {exp.period}
                  </span>
                  
                  <h3 className="text-lg font-bold text-white group-hover/timeline:text-accent transition-colors duration-300">
                    {exp.role}
                  </h3>
                  
                  <div className="text-xs font-mono text-neutral-400 font-bold mb-2 flex items-center gap-1">
                    <IconMapPin size={12} /> {exp.company}
                  </div>

                  <ul className="flex flex-col gap-1.5 pl-4 list-disc text-xs text-neutral-400 leading-relaxed font-medium">
                    {exp.description.map((desc, dIdx) => (
                      <li key={dIdx}>{desc}</li>
                    ))}
                  </ul>

                  {exp.skills && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[9px] font-mono tracking-wider bg-white/[0.02] border border-white/5 text-neutral-400 group-hover/timeline:border-accent/20 group-hover/timeline:text-white transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Education & Certifications (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          
          {/* Education Sub-Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-mono">
                <IconSchool size={14} /> Academic Foundation
              </div>
              <h3 className="text-xl font-bold text-white">Education</h3>
            </div>

            <div className="flex flex-col gap-4">
              {EDUCATION_DATA.map((edu, idx) => (
                <div
                  key={idx}
                  className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden transition-all duration-300 hover:border-white/10"
                >
                  <span className="text-[10px] font-bold font-mono text-accent uppercase tracking-wider block mb-1">
                    {edu.period}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-0.5">{edu.degree}</h4>
                  <div className="text-xs font-semibold text-neutral-400 mb-2">{edu.school}</div>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Sub-Section with images */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-mono">
                <IconAward size={14} /> Official Credentials
              </div>
              <h3 className="text-xl font-bold text-white">Certifications & Credentials</h3>
            </div>

            <div className="flex flex-col gap-6">
              {CERTIFICATES_DATA.map((cert, idx) => (
                <div
                  key={idx}
                  className="glass rounded-xl p-5 border border-white/5 flex flex-col gap-4 transition-all duration-300 hover:border-white/15 relative group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <IconCertificate size={12} className="text-accent" /> {cert.issuer}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors duration-300">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Container removed */}
                </div>

              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
})

export default ExperienceSection
