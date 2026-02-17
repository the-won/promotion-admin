/**
 * 개인정보처리방침 HTML 생성기
 * data.sections 배열을 순회하며 전체 HTML 문서 생성
 */
export function generatePrivacyHtml(data) {

  const nl2br = (text) => {
    if (!text) return ''
    return text.replace(/\n/g, '<br>')
  }

  // ── 일반 테이블 ──
  const generateNormalTable = (table) => {
    const colWidth = Math.floor(100 / table.columns.length)
    const colgroup = table.columns.map(() =>
      `<col style="width:${colWidth}%">`
    ).join('')

    const thead = table.columns.map(col =>
      `<th scope="col" style="background:#f3f4f6;border:1px solid #d1d5db;padding:10px 12px;font-weight:600;text-align:center;color:#111;font-size:13px;">${col}</th>`
    ).join('')

    const tbody = table.rows.map(row => {
      const cells = row.cells.map(cell =>
        `<td style="border:1px solid #d1d5db;padding:10px 12px;vertical-align:top;color:#374151;font-size:13px;line-height:1.7;">${nl2br(cell)}</td>`
      ).join('')
      return `<tr>${cells}</tr>`
    }).join('\n')

    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:8px;">
      <colgroup>${colgroup}</colgroup>
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>`
  }

  // ── key-value 테이블 (행태정보) ──
  const generateKvTable = (table) => {
    const tbody = table.rows.map(row =>
      `<tr>
        <th scope="col" style="background:#f3f4f6;border:1px solid #d1d5db;padding:10px 12px;font-weight:600;text-align:left;color:#111;font-size:13px;width:30%;vertical-align:middle;">${nl2br(row.cells[0] || '')}</th>
        <td style="border:1px solid #d1d5db;padding:10px 12px;vertical-align:top;color:#374151;font-size:13px;line-height:1.7;">${nl2br(row.cells[1] || '')}</td>
      </tr>`
    ).join('\n')

    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:8px;">
      <tbody>${tbody}</tbody>
    </table>`
  }

  // ── 테이블 분기 ──
  const generateTable = (table) => {
    let html = ''
    if (table.caption) {
      html += `<p style="font-size:14px;font-weight:700;color:#111;margin:0 0 8px;"><strong>${table.caption}</strong></p>\n`
    }
    html += table.preset === 'behavior-kv'
      ? generateKvTable(table)
      : generateNormalTable(table)

    if (table.note) {
      html += `\n<p style="font-size:13px;color:#dc2626;font-weight:600;margin:4px 0 16px;">${table.note}</p>`
    }
    return html
  }

  // ── 섹션 ──
  const sections = (data.sections || [])
  
  const sectionsHtml = sections.map((section, idx) => {
    let html = `<div style="margin-bottom:28px;">
      <h2 style="font-size:16px;font-weight:700;color:#111;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">${idx + 1}. ${section.heading}</h2>`

    if (section.bodyText) {
      html += `<p style="font-size:14px;line-height:1.8;margin:0 0 16px;">${nl2br(section.bodyText)}</p>`
    }

    if (section.tables && section.tables.length > 0) {
      section.tables.forEach(t => { html += generateTable(t) })
    }

    if (section.listItems && section.listItems.length > 0) {
      const items = section.listItems.map(item =>
        `<li style="margin-bottom:10px;font-size:14px;line-height:1.7;">${nl2br(item)}</li>`
      ).join('\n')
      html += `<ul style="padding-left:20px;margin:0 0 16px;">${items}</ul>`
    }

    html += `</div>`
    return html
  }).join('\n')

  // ── 목차 ──
  const tocItems = sections.map((s, i) =>
    `<li style="font-size:13px;color:#374151;padding:3px 0;"><strong style="color:#111;">${i + 1}.</strong> ${s.heading}</li>`
  ).join('\n')

  const tocHtml = sections.length > 0
    ? `<div style="margin-bottom:24px;">
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:4px 20px;">
          ${tocItems}
        </ul>
      </div>` : ''

  // ── 안내문 ──
  const introHtml = data.introText
    ? `<div style="margin-bottom:24px;padding:16px;background:#f5f0e6;border:1px solid #d4c9a8;border-radius:4px;font-size:13px;line-height:1.8;color:#5d4e37;">${nl2br(data.introText)}</div>` : ''

  // ── 부칙 ──
  const effectiveHtml = data.effectiveDate
    ? `<div style="margin-bottom:28px;">
        <h2 style="font-size:16px;font-weight:700;color:#111;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">부칙</h2>
        <p style="font-size:14px;line-height:1.8;">본 개인정보처리방침은 ${data.effectiveDate}부터 시행합니다.</p>
      </div>` : ''

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${data.title || '개인정보 처리방침'}</title>
  <style type="text/css">
    body{margin:0;padding:0;font-family:'Malgun Gothic','맑은 고딕',sans-serif;font-size:14px;line-height:1.7;color:#333;background:#f4f4f4;}
    table{border-collapse:collapse;}
  </style>
</head>
<body>
<center style="width:100%;background:#f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="background:#fff;max-width:720px;margin:0 auto;padding:40px;">
          <tr>
            <td>
              <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #333;">
                <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px;">${data.title || '개인정보 처리방침'}</h1>
                ${data.subtitle ? `<p style="font-size:14px;color:#dc2626;margin:0;">${data.subtitle}</p>` : ''}
              </div>
${tocHtml}
${introHtml}
${sectionsHtml}
${effectiveHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</center>
</body>
</html>`
}