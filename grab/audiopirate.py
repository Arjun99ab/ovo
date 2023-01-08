import requests

base_url = "https://eb0dd73c-4471-4d4e-8b5c-cbbf351119ac.poki-gdn.com/20a9b634-e6d1-47d1-a12e-7edb8ed184ba/media/"

with open('out.txt', 'r') as input:
    for line in input:
        line = line.strip()
        url = base_url + line
        doc = requests.get(url=url)
        with open("images/" + line, "wb") as f:
            f.write(doc.content)
        f.close()


