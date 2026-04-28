import urllib.request
from html.parser import HTMLParser
import re

class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = set()
        
    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            for attr in attrs:
                if attr[0] == 'src':
                    self.images.add(attr[1])
        else:
            for attr in attrs:
                if attr[0] == 'style':
                    matches = re.findall(r'url\((.*?)\)', attr[1])
                    for match in matches:
                        self.images.add(match.strip("'\""))

urls = [
    'https://redzrestaurant.com/',
    'https://redzrestaurant.com/menus',
    'https://redzrestaurant.com/private-dining',
    'https://redzrestaurant.com/banquets',
    'https://redzrestaurant.com/news-and-events',
    'https://redzrestaurant.com/about-redz-restaurant',
    'https://redzrestaurant.com/contact'
]

all_images = set()
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            parser = ImageParser()
            parser.feed(html)
            # Also search for CSS background images in style blocks or inline
            matches = re.findall(r'url\((.*?)\)', html)
            for m in matches:
                parser.images.add(m.strip("'\""))
            
            for img in parser.images:
                if img.startswith('http'):
                    all_images.add(img)
                elif img.startswith('//'):
                    all_images.add('https:' + img)
                elif img.startswith('/'):
                    all_images.add('https://redzrestaurant.com' + img)
    except Exception as e:
        print(f"Error fetching {url}: {e}")

for img in sorted(list(all_images)):
    if img.endswith('.jpg') or img.endswith('.png') or img.endswith('.jpeg'):
        print(img)
