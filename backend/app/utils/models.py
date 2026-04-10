from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class FetchGithubRequest(BaseModel):
    username: str

class GithubRepo(BaseModel):
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    stargazers_count: int
    html_url: str
    fork: bool

class GithubUserData(BaseModel):
    login: str
    name: Optional[str] = None
    avatar_url: str
    bio: Optional[str] = None
    public_repos: int
    followers: int
    html_url: str

class FetchGithubResponse(BaseModel):
    user: GithubUserData
    repos: List[GithubRepo]
    languages: Dict[str, int]
    language_timeline: List[Dict[str, Any]]
    total_stars: int

class GeneratePortfolioRequest(BaseModel):
    user: GithubUserData
    repos: List[GithubRepo]
    languages: Dict[str, int]
    resume_text: Optional[str] = None

class AISuggestionResponse(BaseModel):
    strengths: List[str]
    growth_areas: List[str]
    suggestions: List[str]
    visualization_ideas: List[str]

class GeneratedPortfolioResponse(BaseModel):
    bio: str
    skill_summary: str
    highlighted_projects: List[GithubRepo]
