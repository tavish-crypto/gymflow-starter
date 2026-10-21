import { Sparkles } from "lucide-react";
import { Card, PageHeader } from "../components/UI";

export function AICoachPage() {
  return (
    <>
      <PageHeader title="AI Coach" subtitle="The product surface is ready. The AI implementation is intentionally yours." />
      <div className="ai-placeholder-layout">
        <Card>
          <div className="ai-placeholder-icon"><Sparkles size={22} /></div>
          <h2>AI is intentionally not connected</h2>
          <p className="muted">
            Implement this after you understand model APIs, structured output, validation and the product safety boundaries.
          </p>
          <div className="learning-steps">
            <div><strong>1</strong><span>Connect Gemini or OpenAI from the server only.</span></div>
            <div><strong>2</strong><span>Ask for structured JSON instead of free-form text.</span></div>
            <div><strong>3</strong><span>Validate every model response with Zod.</span></div>
            <div><strong>4</strong><span>Let the user review suggestions before saving.</span></div>
          </div>
        </Card>
        <Card>
          <h2>Endpoints already reserved</h2>
          <code className="code-block">POST /api/ai/workout-plan</code>
          <code className="code-block">POST /api/ai/nutrition</code>
          <code className="code-block">POST /api/ai/progress-summary</code>
          <p className="muted">They currently return HTTP 501 so no fake AI behavior appears in the project.</p>
        </Card>
      </div>
    </>
  );
}
