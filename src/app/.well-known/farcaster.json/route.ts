export async function GET() {
  const manifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
      "payload": "eyJkb21haW4iOiJhcHAuZXhhbXBsZS5jb20ifQ",
      "signature": "MHgxMGQwZGU4ZGYwZDUwZTdmMGIxN2YxMTU2NDI1MjRmZTY0MTUyZGU4ZGU1MWU0MThiYjU4ZjVmZmQxYjRjNDBiNGVlZTRhNDcwNmVmNjhlMzQ0ZGQ5MDBkYmQyMmNlMmVlZGY5ZGQ0N2JlNWRmNzMwYzUxNjE4OWVjZDJjY2Y0MDFj"
    },
    "miniapp": {
      "version": "1",
      "name": "FarmCaster",
      "homeUrl": "https://farmcaster-six.vercel.app",
      "iconUrl": "https://farmcaster-six.vercel.app/images/icon.png",
      "splashImageUrl": "https://farmcaster-six.vercel.app/images/splash.png",
      "splashBackgroundColor": "#0f172a",
      "webhookUrl": "https://farmcaster-six.vercel.app/api/webhook",
      "subtitle": "Plant seeds, harvest rewards",
      "description": "Plant seeds, harvest rewards on chain! 🚜",
      "screenshotUrls": [
        "https://farmcaster-six.vercel.app/images/s1.png",
        "https://farmcaster-six.vercel.app/images/s2.png",
        "https://farmcaster-six.vercel.app/images/s3.png"
      ],
      "primaryCategory": "games",
      "tags": ["game", "base", "farming"],
      "heroImageUrl": "https://farmcaster-six.vercel.app/images/cover.png",
      "tagline": "Plant seeds, harvest rewards",
      "ogTitle": "FarmCaster",
      "ogDescription": "Plant seeds, harvest rewards on chain! 🚜",
      "ogImageUrl": "https://farmcaster-six.vercel.app/images/cover.png",
      "noindex": true
    }
  };

  return Response.json(manifest);
}
