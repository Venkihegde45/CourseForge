import time
import logging
import google.generativeai as genai
from typing import Any, List, Union, Optional
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure the native Gemini SDK
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY is not set in environment settings.")

def get_model(model_name: str = "gemini-flash-latest", system_instruction: Optional[str] = None) -> genai.GenerativeModel:
    """
    Returns a configured native Gemini model instance.
    """
    logger.info(f"Using Gemini model: {model_name}")
    return genai.GenerativeModel(
        model_name=model_name,
        system_instruction=system_instruction
    )

def invoke_with_retry(
    prompt: str, 
    system_instruction: Optional[str] = None,
    model_name: str = "gemini-flash-latest", 
    max_attempts: int = 5
) -> str:
    """
    Invokes the native Gemini SDK with manual exponential backoff for 429 errors.
    Returns the text content of the response.
    """
    attempt = 0
    base_delay = 8

    while attempt < max_attempts:
        try:
            # Re-initialize model with instructions on each attempt if needed
            model = get_model(model_name, system_instruction=system_instruction)
            response = model.generate_content(prompt)
            
            if not response or not response.text:
                raise Exception("Empty response from Gemini API")
            
            return response.text
        except Exception as e:
            error_str = str(e)
            
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                attempt += 1
                if attempt >= max_attempts:
                    logger.error(f"Max attempts reached for AI call ({model_name}). Error: {error_str}")
                    raise e
                
                delay = base_delay * (2 ** (attempt - 1))
                
                try:
                    import re
                    match = re.search(r"retry in ([\d\.]+)s", error_str)
                    if match:
                        delay = float(match.group(1)) + 2
                except:
                    pass

                logger.warning(f"AI ({model_name}) is busy, retrying in {int(delay)} seconds... (Attempt {attempt}/{max_attempts})")
                time.sleep(delay)
            else:
                logger.error(f"AI call failed ({model_name}) with non-retryable error: {error_str}")
                raise e
