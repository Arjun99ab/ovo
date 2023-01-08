with open('log.txt') as log:
    with open('out.txt', 'a') as output:
        for line in log:
            first_split = line.split(" 404", 1)[0]
            second_split = first_split.split("http://127.0.0.1:5501/v1.0.1/", 1)[1]
            output.write(second_split + "\n")
        output.close()
    log.close()


# str1 = "what1... is this?"
# sep = '...'
# stripped = str1.split(sep, 1)[0]
# print(stripped)
        