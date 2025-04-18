# services/ai_client.py

import httpx
from fastapi import HTTPException

AI_SERVER_URL = "https://mm-ai.shaandewang.publicvm.com"

async def fetch_predictions(domain: str) -> str:
    async with httpx.AsyncClient(timeout=100.0) as client:
        response = await client.get(f"{AI_SERVER_URL}/predict/", params={"d": domain})
        response.raise_for_status()
        return response.json()

async def fetch_roadmap(domain_id: int, mentee_id: int):
    url = f"{AI_SERVER_URL}/roadmaps/generate/"
    payload = {
        "domain_id": domain_id,
        "mentee_id": mentee_id
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"AI server error: {response.text}"
        )

    return response.json()

async def fetch_feedback(mentee_id: int, feedback_id: int):
    url = f"{AI_SERVER_URL}/mentee/feedback/{mentee_id}/{feedback_id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"AI server error: {response.text}"
        )

    return response.json()


async def fetch_summary(text: str):
    url = f"{AI_SERVER_URL}/summarize"
    params = {"text": text}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"AI server error: {response.text}"
        )

    return response.json()