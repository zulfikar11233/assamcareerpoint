import { NextRequest, NextResponse } from 'next/server'

const FB_TOKEN   = process.env.FACEBOOK_PAGE_TOKEN
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID

async function postToFacebook(message: string, link: string): Promise<boolean> {
  if (!FB_TOKEN || !FB_PAGE_ID) return false
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          link: link,
          access_token: FB_TOKEN,
        }),
      }
    )
    const data = await res.json()
    if (data.error) {
      console.error('Facebook error:', data.error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Facebook post failed:', err)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    let message = ''
    let link    = ''

    if (type === 'job') {
      const totalV = data.posts?.reduce((a: number, p: any) => a + p.vacancy, 0)
                     || parseInt(data.vacancy || '0')
      const lastDate = data.lastDate
        ? new Date(data.lastDate).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—'

      link = `https://www.assamcareerpoint-info.com/jobs/${data.id}`

      message =
        `🏛️ NEW JOB ALERT!\n\n` +
        `${data.title}\n\n` +
        `🏢 Organisation: ${data.org}\n` +
        `📍 Location: ${data.district}\n` +
        `👥 Vacancies: ${totalV.toLocaleString('en-IN')} Posts\n` +
        `📅 Last Date: ${lastDate}\n` +
        `🎓 Qualification: ${data.qualification || '—'}\n\n` +
        `👉 Full Details & Apply Link:\n${link}\n\n` +
        `Follow Assam Career Point for daily job updates!`
    }

    if (type === 'exam') {
      const examDate = data.examDate
        ? new Date(data.examDate).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—'
      const applyLast = data.applicationLastDate
        ? new Date(data.applicationLastDate).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })
        : '—'

      link = `https://www.assamcareerpoint-info.com/exams/${data.id}`

      message =
        `📚 EXAM NOTIFICATION!\n\n` +
        `${data.emoji || '📝'} ${data.title}\n\n` +
        `🏛️ Conducted By: ${data.conductedBy}\n` +
        `📝 Apply By: ${applyLast}\n` +
        `📅 Exam Date: ${examDate}\n\n` +
        `👉 Full Details:\n${link}\n\n` +
        `Follow Assam Career Point for daily updates!`
    }

    if (!message) {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    const fbOk = await postToFacebook(message, link)

    return NextResponse.json({
      success: true,
      facebook: fbOk,
    })

  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}