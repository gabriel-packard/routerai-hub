export type Review = { text: string; source: string; url: string };

export interface AiTool {
  name: string;
  description: string;
  site: string;
  positives: Review[];
  negatives: Review[];
}

export type CategoryKey =
  | "education"
  | "free"
  | "paid"
  | "developer"
  | "content"
  | "media"
  | "cyber";

export interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  blurb: string;
  tools: AiTool[];
}

const r = (text: string, source: string, url: string): Review => ({ text, source, url });

export const CATEGORIES: Category[] = [
  {
    key: "education",
    label: "Education",
    emoji: "🎓",
    blurb: "Tutors, study buddies, and learning platforms.",
    tools: [
      {
        name: "Khanmigo",
        description: "Khan Academy's AI tutor for students and teachers.",
        site: "https://www.khanmigo.ai/",
        positives: [
          r("Helps my kid understand math step by step.", "Trustpilot", "https://www.trustpilot.com/review/khanacademy.org"),
          r("A great Socratic tutor for high schoolers.", "Common Sense Media", "https://www.commonsensemedia.org/ai-ratings/khanmigo"),
        ],
        negatives: [
          r("Occasionally gives incorrect math steps.", "Reddit", "https://www.reddit.com/r/Teachers/comments/1arxxxx/khanmigo/"),
          r("Subscription pricing feels steep for families.", "Trustpilot", "https://www.trustpilot.com/review/khanacademy.org"),
        ],
      },
      {
        name: "Duolingo Max",
        description: "AI-powered language learning with roleplay and explanations.",
        site: "https://www.duolingo.com/",
        positives: [
          r("Roleplay conversations feel surprisingly natural.", "App Store", "https://apps.apple.com/us/app/duolingo/id570060128"),
          r("Explain My Answer helps me actually learn grammar.", "Reddit", "https://www.reddit.com/r/duolingo/"),
        ],
        negatives: [
          r("Max tier is expensive vs. the free version.", "Trustpilot", "https://www.trustpilot.com/review/duolingo.com"),
          r("AI responses can loop or repeat prompts.", "Reddit", "https://www.reddit.com/r/duolingo/"),
        ],
      },
    ],
  },
  {
    key: "free",
    label: "Completely Free",
    emoji: "🎁",
    blurb: "Powerful AI you can use without paying a cent.",
    tools: [
      {
        name: "Google Gemini (free tier)",
        description: "General-purpose AI assistant with generous free access.",
        site: "https://gemini.google.com/",
        positives: [
          r("Fast, accurate, and integrates with Google apps.", "G2", "https://www.g2.com/products/google-gemini/reviews"),
          r("Great free multimodal capabilities.", "Product Hunt", "https://www.producthunt.com/products/google-gemini"),
        ],
        negatives: [
          r("Occasionally refuses reasonable prompts.", "Reddit", "https://www.reddit.com/r/Bard/"),
          r("Answers vary in depth compared to paid models.", "G2", "https://www.g2.com/products/google-gemini/reviews"),
        ],
      },
      {
        name: "Hugging Face Chat",
        description: "Open-source chat interface with multiple free models.",
        site: "https://huggingface.co/chat",
        positives: [
          r("Amazing that so many open models are free.", "Reddit", "https://www.reddit.com/r/LocalLLaMA/"),
          r("Great for experimenting with different LLMs.", "Product Hunt", "https://www.producthunt.com/products/huggingface"),
        ],
        negatives: [
          r("UI is a bit bare compared to ChatGPT.", "Reddit", "https://www.reddit.com/r/LocalLLaMA/"),
          r("Quality depends heavily on the chosen model.", "G2", "https://www.g2.com/products/hugging-face/reviews"),
        ],
      },
    ],
  },
  {
    key: "paid",
    label: "Paid Only",
    emoji: "💳",
    blurb: "Premium platforms with subscription pricing.",
    tools: [
      {
        name: "ChatGPT Plus",
        description: "OpenAI's flagship chatbot with GPT-5 and advanced tools.",
        site: "https://chat.openai.com/",
        positives: [
          r("Best all-around assistant I've used for work.", "Trustpilot", "https://www.trustpilot.com/review/openai.com"),
          r("Voice mode and image analysis are game changers.", "G2", "https://www.g2.com/products/chatgpt/reviews"),
        ],
        negatives: [
          r("Message caps on newer models feel restrictive.", "Reddit", "https://www.reddit.com/r/ChatGPTPro/"),
          r("Occasional downtime during peak hours.", "Trustpilot", "https://www.trustpilot.com/review/openai.com"),
        ],
      },
      {
        name: "Claude Pro",
        description: "Anthropic's thoughtful assistant with long-context reasoning.",
        site: "https://claude.ai/",
        positives: [
          r("Best writing partner for long-form docs.", "G2", "https://www.g2.com/products/claude/reviews"),
          r("Great at coding and following nuanced instructions.", "Reddit", "https://www.reddit.com/r/ClaudeAI/"),
        ],
        negatives: [
          r("Usage limits kick in fast on Pro plan.", "Reddit", "https://www.reddit.com/r/ClaudeAI/"),
          r("Refuses tasks other AIs handle without issue.", "G2", "https://www.g2.com/products/claude/reviews"),
        ],
      },
    ],
  },
  {
    key: "developer",
    label: "Developer AI",
    emoji: "🛠️",
    blurb: "Code assistants and dev-focused copilots.",
    tools: [
      {
        name: "GitHub Copilot",
        description: "In-editor code completions and chat from GitHub + OpenAI.",
        site: "https://github.com/features/copilot",
        positives: [
          r("Massive productivity boost for boilerplate code.", "G2", "https://www.g2.com/products/github-copilot/reviews"),
          r("Chat inside VS Code is really handy.", "Reddit", "https://www.reddit.com/r/github/"),
        ],
        negatives: [
          r("Sometimes suggests deprecated APIs.", "G2", "https://www.g2.com/products/github-copilot/reviews"),
          r("Enterprise pricing adds up quickly.", "Trustpilot", "https://www.trustpilot.com/review/github.com"),
        ],
      },
      {
        name: "Cursor",
        description: "AI-first code editor built on VS Code.",
        site: "https://cursor.sh/",
        positives: [
          r("Composer mode edits multiple files like magic.", "Product Hunt", "https://www.producthunt.com/products/cursor"),
          r("Fastest way I've found to prototype apps.", "Reddit", "https://www.reddit.com/r/cursor/"),
        ],
        negatives: [
          r("Can get expensive on the premium model.", "Reddit", "https://www.reddit.com/r/cursor/"),
          r("Occasional lag on big projects.", "Product Hunt", "https://www.producthunt.com/products/cursor"),
        ],
      },
      {
        name: "Codeium",
        description: "Free AI autocomplete and chat for developers.",
        site: "https://codeium.com/",
        positives: [
          r("Impressive free alternative to Copilot.", "G2", "https://www.g2.com/products/codeium/reviews"),
          r("Works across dozens of editors.", "Product Hunt", "https://www.producthunt.com/products/codeium"),
        ],
        negatives: [
          r("Completion quality trails Copilot slightly.", "Reddit", "https://www.reddit.com/r/Codeium/"),
          r("Enterprise onboarding felt clunky.", "G2", "https://www.g2.com/products/codeium/reviews"),
        ],
      },
    ],
  },
  {
    key: "content",
    label: "Content Creation",
    emoji: "✍️",
    blurb: "Copywriting, marketing, and content workflows.",
    tools: [
      {
        name: "Jasper",
        description: "Marketing AI for teams — blogs, ads, and brand voice.",
        site: "https://www.jasper.ai/",
        positives: [
          r("Brand Voice keeps our copy on-brand at scale.", "G2", "https://www.g2.com/products/jasper/reviews"),
          r("Templates save hours on ad copy.", "Trustpilot", "https://www.trustpilot.com/review/jasper.ai"),
        ],
        negatives: [
          r("Pricey compared to using ChatGPT directly.", "G2", "https://www.g2.com/products/jasper/reviews"),
          r("Outputs can feel generic without heavy editing.", "Trustpilot", "https://www.trustpilot.com/review/jasper.ai"),
        ],
      },
      {
        name: "Copy.ai",
        description: "AI copy platform for sales & marketing teams.",
        site: "https://www.copy.ai/",
        positives: [
          r("Quick way to draft outbound emails.", "G2", "https://www.g2.com/products/copy-ai/reviews"),
          r("Workflows automate a lot of grunt work.", "Trustpilot", "https://www.trustpilot.com/review/copy.ai"),
        ],
        negatives: [
          r("Output quality varies wildly.", "G2", "https://www.g2.com/products/copy-ai/reviews"),
          r("Support responses can be slow.", "Trustpilot", "https://www.trustpilot.com/review/copy.ai"),
        ],
      },
    ],
  },
  {
    key: "media",
    label: "Media Generation",
    emoji: "🎨",
    blurb: "Images, video, and audio powered by AI.",
    tools: [
      {
        name: "Midjourney",
        description: "Industry-leading AI image generator via Discord & web.",
        site: "https://www.midjourney.com/",
        positives: [
          r("Stunning, artistic image quality.", "Reddit", "https://www.reddit.com/r/midjourney/"),
          r("V6 handles text and hands really well now.", "Product Hunt", "https://www.producthunt.com/products/midjourney"),
        ],
        negatives: [
          r("Discord-first workflow is confusing at first.", "Trustpilot", "https://www.trustpilot.com/review/midjourney.com"),
          r("No free tier anymore.", "Reddit", "https://www.reddit.com/r/midjourney/"),
        ],
      },
      {
        name: "ElevenLabs",
        description: "Ultra-realistic AI voices and voice cloning.",
        site: "https://elevenlabs.io/",
        positives: [
          r("The most natural TTS I've ever heard.", "G2", "https://www.g2.com/products/elevenlabs/reviews"),
          r("Voice cloning is scary good.", "Product Hunt", "https://www.producthunt.com/products/elevenlabs"),
        ],
        negatives: [
          r("Character limits burn fast on paid plans.", "Reddit", "https://www.reddit.com/r/ElevenLabs/"),
          r("Some accents still sound off.", "G2", "https://www.g2.com/products/elevenlabs/reviews"),
        ],
      },
      {
        name: "Runway",
        description: "AI video generation and editing suite.",
        site: "https://runwayml.com/",
        positives: [
          r("Gen-3 video quality is incredible.", "Product Hunt", "https://www.producthunt.com/products/runway"),
          r("Great for quick creative prototypes.", "G2", "https://www.g2.com/products/runway/reviews"),
        ],
        negatives: [
          r("Credit system runs out quickly.", "Reddit", "https://www.reddit.com/r/RunwayML/"),
          r("Long render queues at peak times.", "G2", "https://www.g2.com/products/runway/reviews"),
        ],
      },
    ],
  },
  {
    key: "cyber",
    label: "Cybersecurity",
    emoji: "🛡️",
    blurb: "AI tools for security teams and defenders.",
    tools: [
      {
        name: "Microsoft Security Copilot",
        description: "AI assistant for SOC analysts across Microsoft security stack.",
        site: "https://www.microsoft.com/en-us/security/business/ai-machine-learning/microsoft-security-copilot",
        positives: [
          r("Speeds up incident triage significantly.", "G2", "https://www.g2.com/products/microsoft-security-copilot/reviews"),
          r("Great integration across Defender/Sentinel.", "Gartner Peer Insights", "https://www.gartner.com/reviews/market/security-solutions"),
        ],
        negatives: [
          r("Requires the full Microsoft security stack.", "Gartner Peer Insights", "https://www.gartner.com/reviews/market/security-solutions"),
          r("Pricing model is complex.", "G2", "https://www.g2.com/products/microsoft-security-copilot/reviews"),
        ],
      },
      {
        name: "Darktrace",
        description: "Self-learning AI for network threat detection & response.",
        site: "https://darktrace.com/",
        positives: [
          r("Catches anomalies traditional SIEMs miss.", "Gartner Peer Insights", "https://www.gartner.com/reviews/market/network-detection-and-response"),
          r("Autonomous response saves analyst hours.", "G2", "https://www.g2.com/products/darktrace/reviews"),
        ],
        negatives: [
          r("Lots of alerts to tune early on.", "G2", "https://www.g2.com/products/darktrace/reviews"),
          r("Enterprise pricing is not transparent.", "Gartner Peer Insights", "https://www.gartner.com/reviews/market/network-detection-and-response"),
        ],
      },
    ],
  },
];
