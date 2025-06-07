from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import asyncpg
import os

DATABASE_URL = os.getenv("DATABASE_URL")

origins = [
    'toonkli.ng',
    'localhost:80',
    'localhost:8000'
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.pool = await asyncpg.create_pool(DATABASE_URL)
    yield
    await app.state.pool.close()

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins = ["*"], allow_credentials = True, allow_methods = ["*"], allow_headers = ["*"])

@app.get("/words/random")
async def get_words_random():
    async with app.state.pool.acquire() as conn:
        result = await conn.fetchrow("SELECT * FROM dictionary order by random() limit 1;")
    return result

# TODO: Limit of 100, but no pagination :o
@app.get("/words")
async def get_words():
    async with app.state.pool.acquire() as conn:
        result = await conn.fetch("SELECT * FROM dictionary order by id limit 100;")
    return result

@app.get("/words/leaderboard")
async def get_words_leaderboard():
    async with app.state.pool.acquire() as conn:
        result = await conn.fetch("""
            select * from (
                select word, 
                    avg(rating)
                from rating 
                join dictionary on rating.dictionary_id = dictionary.id
                group by word)
            order by avg desc, word;
            """);
    return result

@app.post("/words/{word_id}/rating")
async def add_rating(word_id: int, rating: int):
    if rating < 0 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating should be between 0 and 5")

    async with app.state.pool.acquire() as conn:
        result = await conn.execute("insert into rating values (default, $1, $2)", word_id, rating)
    return result

