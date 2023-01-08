import wget
import os
base_url = "https://eb0dd73c-4471-4d4e-8b5c-cbbf351119ac.poki-gdn.com/20a9b634-e6d1-47d1-a12e-7edb8ed184ba/"

# with open('out.txt', 'r') as input:
#     for line in input:
#         line = line.strip()
#         url = base_url + line
#         print(url)
#         wget.download(url, "images/" + line)

wget.download(base_url + "skin_electrical_rightarm.obj", "images/skin_electrical_rightarm.obj")

count = 0
for root_dir, cur_dir, files in os.walk('images/'):
    count += len(files)
print('file count:', count)

