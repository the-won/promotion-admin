import { getHeaderConfig, getHeaderDetailUrl } from '../../config/headerConfig.js'

export function generateHeaderHtml(headerType, companyType) {
  const config = getHeaderConfig(headerType)
  const detailUrl = getHeaderDetailUrl(headerType, companyType)

  return `<table cellspacing="0" cellpadding="0" width="100%" border="0">
        <tbody>
          <tr>
            <td height="88" rowspan="2" width="148"><img alt="${config.logoAlt}" src="${config.logoUrl}" width="${config.logoWidth}" height="${config.logoHeight}"></td>
            <td height="51" align="right"></td>
            <td height="88" rowspan="2" width="325">
              <a href="${detailUrl}" target="_blank" title="상세조회">
                <img border="0" alt="${config.bannerAlt}" src="${config.bannerUrl}" width="${config.bannerWidth}" height="${config.bannerHeight}">
              </a>
            </td>
          </tr>
          <tr>
            <td style="FONT-SIZE: 12px" height="37" valign="top" align="right"><strong>%UserName%님</strong></td>
          </tr>
        </tbody>
      </table>`
}
