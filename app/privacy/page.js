export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <a href="/" className="privacy-back">
        <span className="material-symbols-outlined">arrow_back</span>
        Back
      </a>
      <div className="privacy-content">
        <p className="hiw-title">Privacy Policy</p>
        <p className="hiw-body" style={{ color: 'rgba(224,240,255,0.4)', fontSize: '0.75rem' }}>Last updated: April 2026</p>

        <p className="hiw-body hiw-accent">We keep it simple.</p>

        <p className="hiw-body">
          When you type a concept and generate analogies, your input is sent to Google&apos;s Gemini API to generate results. We do not store your inputs unless you rate an analogy.
        </p>

        <p className="hiw-body">
          If you rate an analogy, we store the concept you typed, the analogy text, and your rating. No account, name, email, or IP address is saved with it.
        </p>

        <p className="hiw-body">
          We do not use cookies, tracking pixels, or analytics. There are no third-party ads.
        </p>

        <p className="hiw-body">
          The only external services used are Google Gemini (AI generation) and Neon (database hosting). Both are used solely to make the app function.
        </p>

        <p className="hiw-body">
          Questions? Contact: <span style={{ color: '#00ffff' }}>hi@ainal.fun</span>
        </p>
      </div>
    </div>
  )
}
