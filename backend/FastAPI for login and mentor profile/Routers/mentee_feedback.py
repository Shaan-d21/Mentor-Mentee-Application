from fastapi import APIRouter, Depends, HTTPException, status, Query
from services.ai_client import fetch_feedback, fetch_summary
from .auth import get_current_user
from typing import Annotated

router = APIRouter(prefix="/ai", tags=["ai"])
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/feedback/{mentee_id}/{feedback_id}", status_code=status.HTTP_200_OK)
async def get_feedback(
    mentee_id: int,
    feedback_id: int,
    user: user_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized Access")

    return await fetch_feedback(mentee_id, feedback_id)


@router.get("/summarize", status_code=status.HTTP_200_OK)
async def get_summary(
    text: str = Query(..., min_length=1),
    user: user_dependency = Depends(get_current_user)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized Access")

    return await fetch_summary(text)
