from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import notion, agent, data_adv, doc_adv, ops, utils, social, network

app = FastAPI(title="Epic Toolbox API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
async def health(): return {"status": "healthy"}

app.include_router(notion.router, prefix="/api/notion", tags=["Notion"])
app.include_router(agent.router, prefix="/api/agent", tags=["AI Agent"])
app.include_router(data_adv.router, prefix="/api/data-adv", tags=["Data Advanced"])
app.include_router(doc_adv.router, prefix="/api/doc-adv", tags=["Document Advanced"])
app.include_router(ops.router, prefix="/api/ops", tags=["Operations Monitoring"])
app.include_router(utils.router, prefix="/api/utils", tags=["Utilities"])
app.include_router(social.router, prefix="/api/social", tags=["Social Media"])
app.include_router(network.router, prefix="/api/network", tags=["Network"])
