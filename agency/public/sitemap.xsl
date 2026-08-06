<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>DisplayAvenue Sitemap</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 2rem; color: #0b1f3a; background: #f7f9fc; }
          h1 { margin: 0 0 .35rem; }
          p { color: #5a6278; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
          th, td { text-align: left; padding: .75rem 1rem; border-bottom: 1px solid #eef1f6; font-size: .92rem; }
          th { background: #000b33; color: #fff; }
          a { color: #0056ff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .meta { margin-bottom: 1.25rem; }
        </style>
      </head>
      <body>
        <h1>DisplayAvenue — Auto Sitemap</h1>
        <p class="meta">
          This XML sitemap is generated automatically from the live CMS.
          URL count: <strong><xsl:value-of select="count(sm:urlset/sm:url)"/></strong>
        </p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last modified</th>
              <th>Change frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sm:urlset/sm:url">
              <tr>
                <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:lastmod"/></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
