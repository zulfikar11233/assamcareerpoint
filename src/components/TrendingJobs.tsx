// src/components/TrendingJobs.tsx
import Link from 'next/link'

type TrendingJob = { id:number; slug?:string; title:string; org?:string; status?:string }

export default function TrendingJobs({ jobs }: { jobs: TrendingJob[] }) {
  if (!jobs.length) return null
  return (
    <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'16px',marginBottom:15}}>
      <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.87rem',color:'#0b1f33',marginBottom:12}}>🔥 Trending Jobs</h3>
      <div style={{display:'flex',flexDirection:'column' as const,gap:9}}>
        {jobs.map(j=>(
          <Link key={j.id} href={`/jobs/${j.slug||j.id}`} style={{display:'flex',alignItems:'flex-start',gap:8,textDecoration:'none',padding:'6px 0',borderBottom:'1px solid #f0f4f8'}}>
            <span style={{fontSize:'.7rem',color:'#c9a227',fontWeight:900,flexShrink:0,marginTop:2}}>»</span>
            <span style={{fontSize:'.78rem',fontWeight:600,color:'#0b1f33',lineHeight:1.35}}>{j.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}