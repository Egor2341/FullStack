from datetime import datetime

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from api.routers.auth import router as auth_router
from api.routers.budgets import router as budgets_router
from api.routers.categories import router as categories_router
from api.routers.expenses import router as expenses_router
from api.routers.incomes import router as incomes_router
from api.routers.roles import router as roles_router
from api.routers.admin import router as admin_router
from api.routers.receipt import router as receipt_router
from api.routers.alpha_vantage_router import router as a_v_router

from config import settings


app = FastAPI()

@app.get("/health", include_in_schema=False)
async def health():
    return {"status": "ok"}

@app.get("/api/health", include_in_schema=False)
async def api_health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(budgets_router)
app.include_router(categories_router)
app.include_router(expenses_router)
app.include_router(incomes_router)
app.include_router(roles_router)
app.include_router(admin_router)
app.include_router(receipt_router)
app.include_router(a_v_router)


@app.get("/sitemap.xml", include_in_schema=False)
async def sitemap(request: Request):
    urls = []

    routes = ["/welcome"]
    for route in routes:
        urls.append(f"""
        <url>
            <loc>{settings.public_base_url}{route}</loc>
            <lastmod>{datetime.now().date()}</lastmod>
            <priority>0.8</priority>
        </url>
        """)
    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            {''.join(urls)}
        </urlset>
        """

    return Response(content=xml_content, media_type="application/xml")


@app.get("/robots.txt", include_in_schema=False)
async def robots():
    content = f"""
    User-agent: *
    Allow: /

    Disallow: /admin

    Sitemap: {settings.public_base_url}/sitemap.xml
    """
    return Response(content=content.strip(), media_type="text/plain")
