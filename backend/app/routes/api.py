from fastapi import APIRouter, HTTPException, UploadFile, File
import io
import pypdf
from app.utils.models import (
    FetchGithubRequest, 
    FetchGithubResponse, 
    GeneratePortfolioRequest, 
    GeneratedPortfolioResponse,
    AISuggestionResponse
)
from app.services.github_service import fetch_github_data
from app.services.ai_service import get_ai_suggestions, generate_portfolio_content

router = APIRouter()

@router.post("/github/fetch", response_model=FetchGithubResponse)
def fetch_github(req: FetchGithubRequest):
    try:
        user, repos, languages, language_timeline, total_stars = fetch_github_data(req.username)
        return FetchGithubResponse(
            user=user,
            repos=repos,
            languages=languages,
            language_timeline=language_timeline,
            total_stars=total_stars
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/ai/suggestions", response_model=AISuggestionResponse)
def ai_suggestions(req: GeneratePortfolioRequest):
    try:
        total_stars = sum(r.stargazers_count for r in req.repos)
        return get_ai_suggestions(
            languages=req.languages,
            total_stars=total_stars,
            repos=req.repos,
            resume_text=req.resume_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to run AI suggestion")

@router.post("/portfolio/generate", response_model=GeneratedPortfolioResponse)
def generate_portfolio(req: GeneratePortfolioRequest):
    try:
        # Pass data directly from the validated Model
        return generate_portfolio_content(
            user=req.user.dict(),
            repos=req.repos,
            languages=req.languages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate portfolio content")

@router.post("/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="File must be a PDF")
            
        content = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
                
        return {"text": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
