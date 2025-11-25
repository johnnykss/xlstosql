import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const usePdfEditor = () => {
  const editPdf = async (file: File, textToAdd?: string, x?: number, y?: number) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)

    // Add text to first page
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    firstPage.drawText(textToAdd || 'Edited text', {
      x: x || 50,
      y: y || 50,
      size: 12,
      color: rgb(0, 0, 0),
      font
    })

    const pdfBytes = await pdfDoc.save()
    return new Blob([pdfBytes], { type: 'application/pdf' })
  }

  const addTextToPdf = async (
    file: File,
    texts: Array<{ text: string; x: number; y: number; page?: number; size?: number }>
  ) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    for (const item of texts) {
      const pageIndex = item.page !== undefined ? item.page : 0
      const page = pages[pageIndex]

      if (page) {
        page.drawText(item.text, {
          x: item.x,
          y: item.y,
          size: item.size || 12,
          color: rgb(0, 0, 0),
          font
        })
      }
    }

    const pdfBytes = await pdfDoc.save()
    return new Blob([pdfBytes], { type: 'application/pdf' })
  }

  const createPdfFromText = async (text: string) => {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Page dimensions (A4)
    const pageWidth = 595.28
    const pageHeight = 841.89
    const margin = 50
    const fontSize = 12
    const lineHeight = fontSize * 1.5
    const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight)

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
    let yPosition = pageHeight - margin
    let lineCount = 0

    // Split text into lines
    const lines = text.split('\n')

    for (const line of lines) {
      if (lineCount >= maxLinesPerPage) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight])
        yPosition = pageHeight - margin
        lineCount = 0
      }

      // Handle long lines by wrapping
      const maxWidth = pageWidth - 2 * margin
      const words = line.split(' ')
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize)

        if (textWidth > maxWidth && currentLine) {
          currentPage.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0)
          })
          yPosition -= lineHeight
          lineCount++
          currentLine = word

          if (lineCount >= maxLinesPerPage) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight])
            yPosition = pageHeight - margin
            lineCount = 0
          }
        } else {
          currentLine = testLine
        }
      }

      if (currentLine) {
        currentPage.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0)
        })
        yPosition -= lineHeight
        lineCount++
      }
    }

    const pdfBytes = await pdfDoc.save()
    return new Blob([pdfBytes], { type: 'application/pdf' })
  }

  return { editPdf, addTextToPdf, createPdfFromText }
}
