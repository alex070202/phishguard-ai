export function buildPhishingReport({ riskScore, riskLevel, detectedIndicators }) {
  const labels = detectedIndicators.map((indicator) => indicator.label.toLowerCase())
  const explanation =
    detectedIndicators.length > 0
      ? `The email was classified as ${riskLevel.toLowerCase()} risk because it contains ${labels.join(', ')}.`
      : 'The email did not match the current high-risk phishing rules.'

  const recommendations =
    riskScore >= 75
      ? [
          'Do not open links or attachments from this message.',
          'Confirm the sender through a known official channel.',
          'Escalate the email to a security administrator for review.',
        ]
      : riskScore >= 45
        ? [
            'Review the sender domain and URL destination carefully.',
            'Do not enter credentials until the request is verified.',
            'Use SPF, DKIM, DMARC, and URL reputation checks in production.',
          ]
        : [
            'Keep normal caution for unexpected account or payment requests.',
            'Use backend reputation services before making a final decision.',
          ]

  return { explanation, recommendations }
}

export function buildImageReport({ aiProbability, status, indicators }) {
  const explanation =
    indicators.length > 0
      ? `The image status is "${status}" because the file matched ${indicators.map((item) => item.label.toLowerCase()).join(', ')}.`
      : 'The image did not match strong file-level AI-generation signals in this placeholder analyzer.'

  const recommendations =
    aiProbability >= 70
      ? [
          'Do not use the image as trusted evidence without independent verification.',
          'Review source, upload chain, and metadata before publishing or accepting it.',
          'Run a dedicated image forensics or AI detector model for production decisions.',
        ]
      : aiProbability >= 45
        ? [
            'Review visual consistency manually: text, hands, edges, lighting, and repeated textures.',
            'Compare the file against known originals or reverse image search results.',
          ]
        : [
            'Preserve the original file for later metadata checks.',
            'Treat this result as informational until a real model is connected.',
          ]

  return { explanation, recommendations }
}
