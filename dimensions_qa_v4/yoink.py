import requests
base_url = "https://eb0dd73c-4471-4d4e-8b5c-cbbf351119ac.poki-gdn.com/976d2b3e-7196-418f-af46-7a42f42fe85f/"

with open('stuff.txt') as file:
    for line in file:
        print(line.strip())
        print(base_url + line)
        open(line.strip(), "wb").write(requests.get(base_url + line.strip()).content)
        
