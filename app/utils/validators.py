"""
输入验证工具函数
"""
import re
from urllib.parse import urlparse


def validate_url(url: str) -> tuple[bool, str]:
    """
    验证 URL 格式
    
    Args:
        url: 待验证的 URL
        
    Returns:
        (是否有效, 错误信息)
    """
    if not url or not url.strip():
        return False, "URL 不能为空"
    
    url = url.strip()
    
    # 检查 URL 格式
    try:
        result = urlparse(url)
        
        # 必须有 scheme (http/https)
        if not result.scheme:
            return False, "URL 必须包含协议（http 或 https）"
        
        if result.scheme not in ['http', 'https']:
            return False, "URL 协议必须是 http 或 https"
        
        # 必须有 netloc (域名)
        if not result.netloc:
            return False, "URL 必须包含有效的域名"
        
        return True, ""
        
    except Exception as e:
        return False, f"URL 格式无效: {str(e)}"


def validate_domain(domain: str) -> tuple[bool, str]:
    """
    验证域名格式
    
    Args:
        domain: 待验证的域名
        
    Returns:
        (是否有效, 错误信息)
    """
    if not domain or not domain.strip():
        return False, "域名不能为空"
    
    domain = domain.strip().lower()
    
    # 域名长度限制
    if len(domain) > 253:
        return False, "域名长度不能超过 253 个字符"
    
    # 检查是否是 IP 地址（支持带端口）
    # 例如: 127.0.0.1, 127.0.0.1:8080, localhost, localhost:3000
    ip_with_port_pattern = r'^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost)(:\d{1,5})?$'
    if re.match(ip_with_port_pattern, domain):
        # 验证 IP 地址的每个部分
        parts = domain.split(':')[0].split('.')
        if len(parts) == 4:
            for part in parts:
                if int(part) > 255:
                    return False, "IP 地址格式无效"
        return True, ""
    
    # 域名格式正则表达式
    # 允许: example.com, sub.example.com, example.co.uk
    # 不允许: -example.com, example-.com, .example.com
    domain_pattern = r'^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'
    
    if not re.match(domain_pattern, domain):
        return False, "域名格式无效，只能包含字母、数字和连字符，且不能以连字符开头或结尾"
    
    # 检查每个标签（点分隔的部分）长度
    labels = domain.split('.')
    for label in labels:
        if len(label) > 63:
            return False, "域名的每个部分长度不能超过 63 个字符"
    
    # 至少要有一个点（顶级域名）
    if len(labels) < 2:
        return False, "域名必须包含至少一个点（例如: example.com）"
    
    return True, ""


def validate_project_name(name: str) -> tuple[bool, str]:
    """
    验证项目名称
    
    Args:
        name: 待验证的项目名称
        
    Returns:
        (是否有效, 错误信息)
    """
    if not name or not name.strip():
        return False, "项目名称不能为空"
    
    name = name.strip()
    
    if len(name) < 2:
        return False, "项目名称至少需要 2 个字符"
    
    if len(name) > 100:
        return False, "项目名称不能超过 100 个字符"
    
    return True, ""
