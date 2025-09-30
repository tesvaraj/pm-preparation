import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


async def evaluate_pm_answer(question_title: str, question_description: str, transcript: str) -> dict:
    """Evaluate a PM interview answer using Claude"""

    prompt = f"""You are an experienced product management interviewer evaluating a candidate's answer to a PM interview question.

Question: {question_title}
Description: {question_description}

Candidate's Answer:
{transcript}

Please evaluate this answer on the following criteria (score each out of 10):
1. Framework/Structure - Did they use a clear framework or structured approach?
2. Clarity - Was the answer clear and easy to follow?
3. Depth - Did they provide sufficient detail and depth in their analysis?
4. User Focus - Did they demonstrate understanding of user needs?
5. Business Acumen - Did they show business/product sense?

Provide your evaluation in JSON format with the following structure:
{{
    "scores": {{
        "framework": <score 1-10>,
        "clarity": <score 1-10>,
        "depth": <score 1-10>,
        "user_focus": <score 1-10>,
        "business_acumen": <score 1-10>
    }},
    "overall_score": <average score>,
    "strengths": ["strength 1", "strength 2", ...],
    "improvements": ["area for improvement 1", "area for improvement 2", ...],
    "summary": "Brief 2-3 sentence summary of the answer quality"
}}

Be constructive but honest in your feedback."""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Parse the JSON response
        response_text = message.content[0].text

        # Extract JSON from the response (Claude might wrap it in markdown)
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()

        evaluation = json.loads(response_text)
        return evaluation

    except Exception as e:
        raise Exception(f"Evaluation failed: {str(e)}")
