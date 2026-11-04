import type { ManualContent } from "../Manual";

const p = "mb-4 leading-relaxed text-foreground/90";
const pLast = "leading-relaxed text-foreground/90";
const ul = "mb-4 list-disc space-y-2 pl-6 text-foreground/90";
const h3 = "mb-3 text-xl font-semibold text-foreground";

export const enContent: ManualContent = {
  title: "Challenge Canvas Manual",
  intro:
    "This manual presents the theory and practice of the Challenge Canvas – a strategic management tool used to diagnose complex problems and structure organizational challenges collaboratively. Here we describe the conceptual foundations (design thinking, problem framing, wicked problems, open innovation) and detail the practical use of the Canvas, including how the Challenge Canvas app works. All content is grounded in academic references (APA 7) to ensure scientific rigor.",
  sections: [
    {
      heading: "Complex Challenges and Design Thinking",
      content: (
        <>
          <p className={p}>
            Complex organizational challenges are often <em>wicked problems</em>: they involve multiple actors, interdependent causes, conflicting values and unpredictable consequences. Rittel and Webber (1973) observed that, in these cases, "there are no right or wrong solutions, only better or worse ones given current conditions". That is why linear analysis methods fail: the problem must be reframed before looking for solutions (the problem itself only becomes clear after attempts to solve it).
          </p>
          <p className={p}>
            The field of complexity science reinforces this view. In the Cynefin model, complex problems call for a leadership style based on experimentation: "probe–sense–respond". This means creating prototypes and hypotheses to test quickly, instead of trying to plan everything in advance.
          </p>
          <p className={p}>
            Design thinking provides key practices for this. Tim Brown (2008) defines design thinking as a discipline that "uses the designer's sensibility and methods to match people's needs with what is technologically feasible and what a viable business strategy can convert into customer value". In other words, it starts from a deep understanding of the user and the context before conceiving solutions. Kees Dorst (2011) highlights that the core of design thinking is the creation of "frames" (new points of view) to approach problem situations. For Dorst, "framing" is precisely the practice of creating a novel point of view from which the problem becomes tractable. Experienced designers identify the central paradox of the challenge (what makes it hard) and only then start looking for solutions, avoiding hasty conclusions. This creative process (abduction) allows the problem to be redefined as the team learns about it. In short, before "going to the solution", design-oriented teams question and reframe the problem, keeping the focus on what matters.
          </p>
          <p className={pLast}>
            Another important theoretical point is cognitive diversity. Studies show that cognitively diverse teams produce better solutions to complex problems than homogeneous teams, even highly skilled ones. Scott Page (2007) argues that "in problem solving, cognitive diversity can trump ability". In other words, different points of view (from different disciplines, experiences or backgrounds) enrich the definition of the problem and raise the group's innovative potential.
          </p>
        </>
      ),
    },
    {
      heading: "Canvas and Open Innovation",
      content: (
        <>
          <p className={p}>
            A Canvas is a visual board made of organized blocks, ideal for collaborative synthesis. As Sneij (2019) points out, a Canvas forces complexity down to a single page, making communication and pattern recognition easier. Tools such as the Business Model Canvas (Osterwalder) are famous examples: they condense key business concepts into well-defined sections. In the same spirit, the Challenge Canvas splits the problem into critical areas (context, stakeholders, goals, constraints, etc.), so the relationships between these parts become evident.
          </p>
          <p className={p}>
            In recent years, open innovation has made the Canvas even more relevant. Large companies use corporate challenges to attract startups and external partners. Pinto and Tamanine (2022) show that, in open innovation, organizing a challenge's information in a visual format increases company–startup collaboration. They developed a "Corporate Challenge Canvas" precisely to capture the essential information of a challenge clearly and improve engagement. In short, the Canvas helps define and communicate the problem in a structured way, both internally and to external audiences (such as potential solvers), making innovation initiatives more effective.
          </p>
          <p className={pLast}>
            Established methodologies such as the Double Diamond (Design Council) also reinforce the idea of separating discovery (problem) and delivery (solution) phases. The Challenge Canvas works in the first part: it corresponds to the "Define" phase (first diamond), when empathy and information are brought together to clarify the challenge before generating ideas. A well-articulated problem is therefore as crucial as the solution itself (Rittel & Webber, 1973).
          </p>
        </>
      ),
    },
    {
      heading: "Structure of the Challenge Canvas",
      content: (
        <>
          <p className={p}>
            The Challenge Canvas usually contains content blocks that help frame the challenge. Although variations exist, a broad model can include, for example:
          </p>
          <ul className={ul}>
            <li><strong>Strategic Context:</strong> current scenario, corporate goals, urgency and expected impact (financial, customer, efficiency).</li>
            <li><strong>Current Problem:</strong> a symptomatic description of what is observed, data and evidence, history and identified root causes.</li>
            <li><strong>Impact:</strong> quantifiable consequences of the problem (costs, risks, key metrics affected).</li>
            <li><strong>Stakeholders/Users:</strong> who is affected by the challenge? Who decides on it? Who are the sponsors or target users?</li>
            <li><strong>Challenge Statement:</strong> a synthesis in the format "How might we [desired goal] for [audience/process] considering [key constraints]?". This statement (HMW – How Might We) is outcome-oriented, not solution-prescriptive.</li>
            <li><strong>Success Criteria:</strong> which indicators will show the challenge is well solved (e.g. numeric targets, deadline, minimum ROI).</li>
            <li><strong>Constraints and Assumptions:</strong> budget, technology or regulatory limitations; beliefs that don't need testing.</li>
            <li><strong>Available Resources:</strong> existing data, infrastructure, dedicated teams, external partnerships, etc.</li>
            <li><strong>Initial Hypotheses:</strong> possible causes or emerging solutions to be tested.</li>
            <li><strong>Solution Approach:</strong> general ideas on how to tackle the problem (methodologies, type of prototype, frameworks, e.g. design sprint, algorithm experiment, etc.).</li>
            <li><strong>Governance:</strong> executive sponsor, project leads, decision group and follow-up dates.</li>
            <li><strong>Expected Deliverables:</strong> prototypes, pilots, business case, final documentation, implementation plan.</li>
          </ul>
          <p className={p}>
            Each section should be filled in collaboratively (in a workshop or at the office) with short, direct text. Guiding questions can help: for Context, ask "Why does this challenge matter now?"; for Stakeholders, "Who are the essential parties to solve this problem?". In general, avoid vague terms (e.g. "optimize process X") or preconceived solutions ("use AI to…"); aim for clear, data-based writing.
          </p>
          <p className={pLast}>
            <strong>Visual Model:</strong> The canvas is usually presented on a single page, with separate boxes for each block. This "forces" the team to focus on what really matters and lets everyone see at a glance how the elements connect. Recommended sources of inspiration include Jorge Sneij's Challenge Canvas (which even suggests splitting the board into two parts: problem and context) and templates from innovation consultancies (or the "Corporate Challenge Canvas" from RBGI 2022).
          </p>
        </>
      ),
    },
    {
      heading: "Filling in the Challenge Canvas",
      content: (
        <>
          <h3 className={h3}>1. Preparation</h3>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Build a multidisciplinary team:</strong> include people from business, technology (IT/data), marketing/users, finance, etc. A diversity of skills enriches the definition of the problem.</li>
            <li><strong>Collect data and insights:</strong> gather current indicators (KPIs), customer feedback, stakeholder interviews, process analyses and root causes (e.g. 5 Whys, Ishikawa diagram).</li>
            <li><strong>Set the strategic context:</strong> understand how the challenge fits the organization's broader strategy (competitive advantage, innovation goals, external pressures). This reinforces relevance and directs focus.</li>
          </ul>

          <h3 className={h3}>2. Collaborative Filling</h3>
          <p className="mb-3 leading-relaxed text-foreground/90">Use the canvas as a dynamic guide. For example:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground/90">
            <li><strong>Strategic Context:</strong> record goals and expected impacts. E.g.: "Reduce stock-outs by 30% to maximize quarterly revenue."</li>
            <li><strong>Current Problem:</strong> describe clear symptoms ("churn rose 15% last year"), supported by data. Separate symptoms from possible causes (avoid jumping straight to the solution).</li>
            <li><strong>Impact:</strong> estimate current losses and dangers (lost revenue, complaints, regulatory risks). Use concrete estimates to prioritize effort.</li>
            <li><strong>Users/Stakeholders:</strong> list who suffers and who decides. For example, "Store managers (decision), supply chain team (execution), end customer (affected)". This avoids overly tech-centric approaches.</li>
            <li><strong>Challenge (How Might We):</strong> phrase the central question in the suggested format. Make sure it is measurable and aligned with strategy. For example: "How might we reduce churn by 20% in the next 12 months without raising CAC?".</li>
            <li><strong>Success Criteria:</strong> define numeric targets (e.g. average service time, NPS, minimum ROI) and time horizons.</li>
            <li><strong>Constraints/Assumptions:</strong> clarify what is fixed ("no extra investment", "valid until the end of the fiscal year", "legal restrictions X") and what will be treated as a hypothesis.</li>
            <li><strong>Resources:</strong> list databases, budgets, available agile frameworks and partnerships (e.g. suppliers, startups, universities) that can support the project.</li>
            <li><strong>Hypotheses:</strong> write down initial assumptions ("we think poor integration between systems causes churn").</li>
          </ul>

          <h3 className={h3}>3. Refinement</h3>
          <p className="mb-3 leading-relaxed text-foreground/90">After the first pass, review the content:</p>
          <ul className={ul}>
            <li><strong>Check for ambiguity:</strong> if the HMW question or other text is vague, rewrite it more precisely, using the data collected.</li>
            <li><strong>Validate goals:</strong> confirm the criteria are challenging but achievable, and relevant to the business.</li>
            <li><strong>Objectivity:</strong> remove jargon and premature solutions from the challenge statement.</li>
            <li><strong>Integration:</strong> make sure every part of the canvas connects (e.g. success goals reflect the impacts described).</li>
          </ul>
          <p className={pLast}>
            This step can be iterative. The Canvas format itself makes gaps easy to spot: if a box stays empty or too generic, more analysis is probably needed.
          </p>
        </>
      ),
    },
    {
      heading: "How Challenge Canvas Works (App)",
      content: (
        <>
          <p className={p}>
            Challenge Canvas is a digital product designed to support exactly this challenge-building process. It is a responsive web app (desktop and tablet) that implements every element of the Canvas, adding artificial intelligence and collaboration tools. Here are the main components and how to use them:
          </p>
          <ul className="mb-6 list-disc space-y-3 pl-6 text-foreground/90">
            <li><strong>Sign-in and Dashboard:</strong> Users create an account (email/password or Google) and access a dashboard with their projects. Each challenge appears as a card with title, date and status (draft, in progress, completed). You can create, edit, duplicate or delete challenges.</li>
            <li><strong>Canvas Editor:</strong> A form divided into sections matching each block of the Challenge Canvas (Context, Problem, Impact, etc.). Each section has a large text box with example placeholders and a microphone for dictation. The layout is clean and executive, and changes are saved automatically.</li>
            <li>
              <strong>AI Assistant:</strong> Each section has buttons to interact with AI. Main functions:
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong>"Improve with AI":</strong> rewrites the current text to be clearer, more strategic and concise.</li>
                <li><strong>"Evaluate Canvas":</strong> analyzes all the content filled in. The AI returns a score (0–100), rates the Canvas as "Weak/Adequate/Strategic", points out the main gaps and suggests overall improvements.</li>
                <li><strong>"Generate Infographic":</strong> creates a visual summary of the evaluated canvas, which is also included in the exported PDF.</li>
              </ul>
            </li>
          </ul>
          <p className={p}>
            These functions support problem framing: for example, reshaping the HMW statement for clarity or uncovering missing success criteria.
          </p>
          <ul className="mb-4 list-disc space-y-3 pl-6 text-foreground/90">
            <li><strong>Export:</strong> When the Canvas is complete, the user can generate an executive PDF report with a professional layout. This makes it easy to share the challenge with executives or in strategy meetings.</li>
            <li><strong>Sharing:</strong> The owner can invite other registered users by email as Viewer or Editor, and can change or remove their access at any time.</li>
            <li>
              <strong>Typical workflow:</strong>
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>Sign in to the app and create a new challenge.</li>
                <li>Fill in the main blocks with what you already know.</li>
                <li>Use the AI Assistant in each section as needed to refine the text.</li>
                <li>Review the AI's overall evaluation and adjust the Canvas accordingly.</li>
                <li>Complete the remaining fields (Governance, Deliverables, Hypotheses).</li>
                <li>Export the final document and present it to leadership or the project team.</li>
              </ol>
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Applied Example (fictional case)",
      content: (
        <>
          <p className={p}>
            <strong>Context:</strong> An online retail chain faces a high churn rate (customer cancellations).
          </p>
          <ol className="mb-4 list-decimal space-y-3 pl-6 text-foreground/90">
            <li><strong>Strategic context:</strong> 30-day customer loss stands at 25%, cutting sales and raising acquisition costs (CAC). The corporate goal is to retain 10% more customers per year and raise NPS from 60 to 75.</li>
            <li><strong>Current Problem:</strong> Internal data show frequent cancellations due to a "bad checkout experience" and "late deliveries". Mapping shows that 40% of cancellations come from the 10% of customers who buy in high volume.</li>
            <li><strong>Impact:</strong> Current churn costs about USD 400k/year. Reducing churn by 10 points would free this amount to reinvest in marketing.</li>
            <li><strong>Stakeholders:</strong> Executive sponsor: E-commerce Director. Team involved: IT (platform), UX/design, logistics operations, BI (data).</li>
            <li><strong>Challenge (HMW):</strong> "How might we reduce churn by 20% in the next 12 months for repeat buyers, without raising CAC?"</li>
            <li><strong>Success:</strong> Target: monthly churn ≤15% within 6 months. Metrics: monthly retention rate, post-sale NPS, ROI of the retention program.</li>
            <li><strong>Constraints:</strong> Fixed budget of USD 10k for an MVP next semester; current (no-code) platform with no back-end changes; delivery policy with standard mail (no express shipping).</li>
            <li><strong>Resources:</strong> Sales/history database, BI team plus a data analyst, contract with a shipping company, customer service chatbots.</li>
            <li><strong>Hypotheses:</strong> Simplifying checkout (fewer clicks) and communicating delivery dates better are expected to reduce dissatisfaction.</li>
            <li><strong>Approach:</strong> Run a UX improvement sprint plus a proactive customer communication pilot.</li>
            <li><strong>Governance:</strong> Biweekly meetings with the CEO; monthly executive report; quarterly strategy review.</li>
            <li><strong>Deliverables:</strong> Working prototype of the checkout flow, BI report clustering high-churn customers, automated communication plan (email/WhatsApp) scheduled for a 3-month test.</li>
          </ol>
          <p className={pLast}>
            This illustrative example shows how the Canvas helps focus on the problem (poor checkout design, logistics) and avoids assuming the exact solution from the start. In Challenge Canvas, each step above would be recorded in its own field, with AI help to refine the problem statement and suggest metrics.
          </p>
        </>
      ),
    },
    {
      heading: "Best Practices and Conclusion",
      content: (
        <>
          <ul className={ul}>
            <li>Different points of view ensure the problem is well understood.</li>
            <li>Use the Canvas to resist the urge to "rush to the solution". Adaptive challenges require iterative reflection.</li>
            <li>Set clear goals, but leave room for creativity in the solution. The "How might we…" format helps with this.</li>
            <li>Challenge Canvas boosts productivity, but the value comes from collective thinking and strategic alignment. AI is a co-pilot to clarify and critique, not a substitute for judgment.</li>
            <li>Even if the final solution changes or fails, documenting hypotheses and results (in the Canvas or the app) builds organizational knowledge.</li>
          </ul>
          <p className={pLast}>
            In short, the Challenge Canvas combines insights from design thinking and open innovation to turn complex problems into measurable challenges. With the supporting digital tool, teams can create, iterate on and share these challenges in an agile, collaborative way. This increases the chance of innovative solutions that are truly aligned with strategy, avoiding scattered efforts. As Page (2007) reminds us, the more diverse and well-defined the inputs (frames), the more likely we are to find effective answers.
          </p>
        </>
      ),
    },
  ],
};
