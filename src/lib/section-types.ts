// src/lib/section-types.ts
// Shared section/link types for Jobs, Exams, Information

export type ContentSectionLink = {
  id: string
  label: string
  url: string
}

export type ContentSection = {
  id: string
  title: string
  content: string
  pdfLink?: string
  pdfName?: string
  links: ContentSectionLink[]
}

export const newContentSectionId = () =>
  `sec_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
export const newContentLinkId = () =>
  `lnk_${Date.now()}_${Math.random().toString(36).slice(2,6)}`