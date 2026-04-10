import os
from openai import OpenAI
import json
from app.utils.models import AISuggestionResponse, GeneratedPortfolioResponse
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    client = None

def get_ai_suggestions(languages: dict, total_stars: int, repos: list, resume_text: str = None) -> AISuggestionResponse:
    if not client:
        # Mock Response dependent on languages/repos to look semi-dynamic
        top_lang = list(languages.keys())[0] if languages else "coding"
        project_count = len(repos)
        return AISuggestionResponse(
            strengths=[f"Strong fundamentals in {top_lang}", f"Management of {project_count} repositories"],
            growth_areas=[f"Could use more testing infrastructure across your top {top_lang} projects", "Consider expanding your architectural patterns"],
            suggestions=[
                f"Consider adding CI/CD pipelines to your top {top_lang} projects to improve reliability", 
                "Build deeper ecosystem integrations in your open source work"
            ],
            visualization_ideas=["Bar chart of commit frequency by language", "Pie chart of language distribution across all repos"]
        )
    
    # Extract top 5 repos for context
    top_repos = sorted(repos, key=lambda x: getattr(x, 'stargazers_count', 0), reverse=True)[:5]
    top_repos_info = [f"{r.name}: {r.description or 'No description'} (Lang: {r.language}, Stars: {r.stargazers_count})" for r in top_repos]

    prompt = f"""
    Act as a Senior AI Staff Engineer reviewing a mid-to-senior developer's portfolio for a high-level technical role.
    Do NOT provide generic advice like "write more tests", "do open source", or "add comments".
    Instead, look closely at their project types, primary languages, and implied system architectures based on repo descriptions. Identify specific technical patterns, missing modern practices in their current stacks, and sophisticated next-steps.

    Developer context:
    Languages used: {languages}
    Total GitHub Stars: {total_stars}
    Top 5 Repositories: {top_repos_info}
    """
    
    if resume_text:
        # Avoid overflowing the prompt, let's limit resume text to first 3000 chars roughly.
        prompt += f"\n    Resume Extract (parsed text):\n    ---START---\n    {resume_text[:3000]}\n    ---END---\n"
    
    prompt += """
    Based on this data, provide a JSON response with:
    1. "strengths": Array of 3 highly specific technical strengths (e.g., "Demonstrates strong command of statically typed backend systems via Go and Rust repos", NOT "good at coding").
    2. "growth_areas": Array of 2 specific technical gaps based on what's MISSING (e.g., "Lacks visible distributed systems orchestration (k8s/terraform) despite heavy microservice footprint", NOT "lack of testing").
    3. "suggestions": Array of 3 actionable, senior-level growth steps (e.g., "Migrate 'repo-name' state management to Zustand/Redux Toolkit to demonstrate modern React capability", NOT "learn Redux").
    4. "visualization_ideas": Array of 2 smart, data visualization chart concepts that would best showcase THIS SPECIFIC developer's data (e.g., "A stacked area chart showing the transition from JavaScript to TypeScript over the last 3 years").
    """
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",  # Using a more capable model for nuanced engineering feedback if possible, else rely on prompt
        messages=[
            {"role": "system", "content": "You are a Senior Principal Engineer reviewing a candidate. You provide brutally honest, highly specific, actionable technical feedback. Output strictly validating JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={ "type": "json_object" }
    )
    
    result = json.loads(response.choices[0].message.content)
    return AISuggestionResponse(**result)

def generate_portfolio_content(user: dict, repos: list, languages: dict) -> GeneratedPortfolioResponse:
    if not client:
        # Mock Response
        sorted_repos = sorted(repos, key=lambda x: x.stargazers_count, reverse=True)[:3]
        return GeneratedPortfolioResponse(
            bio=f"Hi, I'm {user.get('name', user.get('login'))}. I am a passionate developer currently building awesome projects.",
            skill_summary="Experienced in modern web technologies and backend integration.",
            highlighted_projects=sorted_repos
        )
        
    prompt = f"""
    Generate portfolio content for a developer:
    Name: {user.get('name', 'Developer')}
    Bio: {user.get('bio', '')}
    Languages: {languages}
    Top Repositories Info: {[r.name + ' (' + str(r.language) + ')' for r in repos[:10]]}

    Provide a JSON response with:
    1. "bio": A short, impactful professional summary (2-3 sentences).
    2. "skill_summary": A one-sentence summary of their technical expertise.
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert technical portfolio builder. Output strictly validating JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={ "type": "json_object" }
    )
    
    result = json.loads(response.choices[0].message.content)
    
    # Just sort and grab top 3 by stars for highlight
    top_repos = sorted(repos, key=lambda x: x.stargazers_count, reverse=True)[:3]
    
    return GeneratedPortfolioResponse(
        bio=result.get("bio", "Passionate developer"),
        skill_summary=result.get("skill_summary", "Experienced software engineer"),
        highlighted_projects=top_repos
    )
