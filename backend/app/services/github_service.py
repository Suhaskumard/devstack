import requests
import json
from app.utils.models import GithubRepo, GithubUserData
from typing import Tuple, List, Dict, Any

GITHUB_API_URL = "https://api.github.com"

def fetch_github_data(username: str) -> Tuple[GithubUserData, List[GithubRepo], Dict[str, int], List[Dict[str, Any]], int]:
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    # Fetch user
    user_resp = requests.get(f"{GITHUB_API_URL}/users/{username}", headers=headers)
    if user_resp.status_code != 200:
        raise Exception("GitHub user not found")
    user_data = user_resp.json()
    
    # Fetch repos (excluding forks for accurate stats, grabbing max 100 for now)
    repos_resp = requests.get(f"{GITHUB_API_URL}/users/{username}/repos?per_page=100&sort=pushed", headers=headers)
    if repos_resp.status_code != 200:
        raise Exception("Could not fetch repositories")
    repos_data = repos_resp.json()
    
    repos = []
    languages = {}
    language_timeline_data = {}
    total_stars = 0
    
    for r in repos_data:
        if r.get("fork") == True:
            continue
        repo = GithubRepo(
            name=r.get("name"),
            description=r.get("description"),
            language=r.get("language"),
            stargazers_count=r.get("stargazers_count", 0),
            html_url=r.get("html_url"),
            fork=r.get("fork", False)
        )
        repos.append(repo)
        
        # Count stars
        total_stars += repo.stargazers_count
        
        # Count languages
        if repo.language:
            languages[repo.language] = languages.get(repo.language, 0) + 1
            
            created_at = r.get("created_at")
            if created_at:
                year = created_at.split("-")[0]
                if year not in language_timeline_data:
                    language_timeline_data[year] = {}
                language_timeline_data[year][repo.language] = language_timeline_data[year].get(repo.language, 0) + 1
            
    user = GithubUserData(
        login=user_data.get("login"),
        name=user_data.get("name"),
        avatar_url=user_data.get("avatar_url"),
        bio=user_data.get("bio"),
        public_repos=user_data.get("public_repos"),
        followers=user_data.get("followers"),
        html_url=user_data.get("html_url")
    )
    language_timeline = []
    for year in sorted(language_timeline_data.keys()):
        entry = {"year": year}
        entry.update(language_timeline_data[year])
        language_timeline.append(entry)
        
    return user, repos, languages, language_timeline, total_stars
