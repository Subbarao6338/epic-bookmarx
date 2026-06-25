import ipaddress
import socket
from fastapi import APIRouter, HTTPException
import requests
import ssl
from typing import Optional

router = APIRouter()

def is_public_ip(ip_str: str) -> bool:
    try:
        ip = ipaddress.ip_address(ip_str)
        return not (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast)
    except ValueError:
        return False

def validate_domain(domain: str):
    try:
        # Resolve domain to IP
        ip_list = socket.gethostbyname_ex(domain)[2]
        for ip in ip_list:
            if not is_public_ip(ip):
                raise HTTPException(status_code=400, detail=f"Domain {domain} resolves to a non-public IP: {ip}")
    except socket.gaierror:
        raise HTTPException(status_code=400, detail=f"Could not resolve domain: {domain}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")

@router.get("/ip-info")
async def get_ip_info(ip: Optional[str] = None):
    if ip and not is_public_ip(ip):
        raise HTTPException(status_code=400, detail="Invalid or private IP address")
    try:
        url = f"https://ipapi.co/{ip}/json/" if ip else "https://ipapi.co/json/"
        res = requests.get(url, timeout=5)
        return res.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/dns")
async def dns_lookup(domain: str):
    validate_domain(domain)
    try:
        results = {}
        for qtype in ['A', 'AAAA', 'MX', 'TXT', 'NS']:
            try:
                if qtype == 'A':
                    results[qtype] = socket.gethostbyname_ex(domain)[2]
            except:
                pass
        return {"domain": domain, "records": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/ssl")
async def ssl_check(domain: str):
    validate_domain(domain)
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                return cert
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/whois")
async def whois_lookup(domain: str):
    validate_domain(domain)
    try:
        res = requests.get(f"https://rdap.org/domain/{domain}", timeout=5)
        return res.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
