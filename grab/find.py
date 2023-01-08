with open('log.txt') as log:
    with open('out.txt', 'a') as output:
        for line in log:
            if ".ogg:1" in line:
                output.write(line.split(":1", 1)[0] + "\n")
        output.close()
    log.close()


# str1 = "what1... is this?"
# sep = '...'
# stripped = str1.split(sep, 1)[0]
# print(stripped)
        