#!/usr/bin/env python3
"""
字体子集化工具
提取项目中使用的字符并生成字体子集
"""

import os
import re
from pathlib import Path
from typing import Set

def extract_chinese_chars(directory: str) -> Set[str]:
    """从项目中提取所有中文字符"""
    chinese_chars = set()
    
    # 支持的文件扩展名
    extensions = {'.md', '.vue', '.ts', '.js', '.json', '.html', '.astro'}
    
    # 遍历目录
    for root, dirs, files in os.walk(directory):
        # 跳过 node_modules 和 .git
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.vitepress']]
        
        for file in files:
            ext = Path(file).suffix
            if ext in extensions:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # 提取中文字符
                        chars = re.findall(r'[\u4e00-\u9fa5]', content)
                        chinese_chars.update(chars)
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return chinese_chars

def generate_subset_chars() -> str:
    """生成字体子集字符集"""
    # 基础中文字符集
    base_chars = "其实你们都是柔情猫娘吧QAQ"
    
    # 从项目中提取字符
    project_chars = extract_chinese_chars('.')
    
    # 合并字符
    all_chars = set(base_chars) | project_chars
    
    # 排序
    sorted_chars = ''.join(sorted(all_chars))
    
    return sorted_chars

def main():
    print("正在提取项目中的中文字符...")
    chars = generate_subset_chars()
    
    print(f"共找到 {len(chars)} 个唯一字符")
    print(f"字符集: {chars}")
    
    # 保存到文件
    with open('font-chars.txt', 'w', encoding='utf-8') as f:
        f.write(chars)
    
    print("字符集已保存到 font-chars.txt")
    print("\n使用以下命令生成字体子集:")
    print("pyftsubset Blueaka.woff2 --text-file=font-chars.txt --output-file=Blueaka-subset.woff2")

if __name__ == '__main__':
    main()
